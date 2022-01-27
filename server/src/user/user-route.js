const {
  isValidDate,
  groupBy,
  distance,
  chaining,
  mapValues,
  sumValues
} = require("../utils");

module.exports = ({ app, db, isLoggedIn }) => {
  const User = require("./user-model")(db);

  const setProps = keys => (user, idx = 0, users = []) => {
    const prevUser = idx === 0 ? {} : users[idx - 1];

    let props = {};
    props.isAuthenticated = true;
    props.lvl = Math.floor(Math.sqrt(user.xp));
    props.lvlXp = user.xp - Math.pow(props.lvl, 2);
    props.reqLvlXp = Math.pow(props.lvl + 1, 2) - Math.pow(props.lvl, 2);
    props.rank = user.score === prevUser.score ? prevUser.rank : idx + 1;

    keys.forEach(key => (user[key] = props[key]));

    return user;
  };

  /**
   * @swagger
   * /user:
   *   get:
   *     summary: Get your user
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */

  app.get("/api/user", (req, res) => {
    const { user = {} } = req;
    if (!req.isAuthenticated()) return res.send({ isAuthenticated: false });

    return res.send(
      setProps(["isAuthenticated", "lvl", "lvlXp", "reqLvlXp"])(user)
    );
  });

  /**
   * @swagger
   * /user:
   *   delete:
   *     summary: Delete your user
   *     tags:
   *       - User
   */

  app.delete("/api/user", isLoggedIn, async (req, res, next) => {
    const { user: req_user = {} } = req;
    const { user, err } = await User.delete(req_user.id);
    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    return res.send(user);
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *               minItems: 3
   */

  app.get("/api/users", isLoggedIn, async (_, res, next) => {
    const { users, err } = await User.getAll();
    if (err) return next(err);
    return res.send(users.map(setProps(["lvl"])));
  });

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get a user
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */

  app.get("/api/users/:id", isLoggedIn, async (req, res, next) => {
    const { params = {} } = req;
    const { user, err } = await User.getById(params.id);

    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    return res.send(setProps(["lvl", "lvlXp", "reqLvlXp"])(user));
  });

  /**
   * @swagger
   * /leaderboard:
   *   get:
   *     summary: Get the leaderboard users
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *               minItems: 3
   */

  app.get("/api/leaderboard", isLoggedIn, async (_, res, next) => {
    const { users, err } = await User.getAllOrderByXp();
    if (err) return next(err);
    return res.send(users.map(setProps(["lvl"])));
  });

  /**
   * @swagger
   * /leaderboard/{from}/{to}:
   *   get:
   *     summary: Get the leaderboard for a period
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: from
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *       - in: path
   *         name: to
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *               minItems: 3
   */

  app.get("/api/leaderboard/:from/:to", isLoggedIn, async (req, res, next) => {
    const { params = {} } = req;
    const { from, to } = params;
    if (!isValidDate(from) || !isValidDate(to)) {
      return res.status(400).send("Incorrect dates");
    }
    const { users, err } = await User.getAllScoreDate(from, to);
    if (err) return next(err);

    const { dists, err: err2 } = await getUserShardDistance(from, to);
    if (err2) return next(err2);

    mapValues(user => (user.dist = dists[user.id]))(users);

    return res.send(users.map(setProps(["rank", "lvl"])));
  });

  async function getUserShardDistance(from, to) {
    let { shards, err } = await User.getAllShardDate(from, to);
    if (err) return { err };

    shards = shards.map(shard => ({
      ...shard,
      date: new Date(shard.created_at).toISOString().split("T")[0]
    }));

    const calcDistance = () => shards => {
      return shards.reduce((res, _, index, arr) => {
        if (index === 0) return res;
        const dist = distance(arr[index - 1], arr[index]);
        return res + dist;
      }, 0);
    };

    const groupByDate = cb => shards => cb(groupBy(shards, "date"));
    const groupByUser = cb => shards => cb(groupBy(shards, "user_id"));

    const groupedShards = chaining(
      groupByUser,
      mapValues,
      groupByDate,
      mapValues,
      calcDistance
    )(shards);

    return { dists: chaining(mapValues, sumValues)(groupedShards) };
  }
};
