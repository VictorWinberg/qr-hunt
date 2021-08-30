module.exports = ({ app, db, isLoggedIn }) => {
  const User = require("./user-model")(db);
  const Achievement = require("../achievement/achievement-model")(db);

  const setProps = keys => (user, idx = 0, users = []) => {
    const prevUser = idx === 0 ? {} : users[idx - 1];

    let props = {};
    props.isAuthenticated = true;
    props.lvl = Math.floor(Math.sqrt(user.xp));
    props.lvlXp = user.xp - Math.pow(props.lvl, 2);
    props.reqLvlXp = Math.pow(props.lvl + 1, 2) - Math.pow(props.lvl, 2);
    props.rank = user.xp === prevUser.xp ? prevUser.rank : idx + 1;

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

  app.delete("/api/user", isLoggedIn, async (req, res) => {
    const { user: req_user = {} } = req;
    const { user, err } = await User.delete(req_user.id);
    if (err) return res.status(500).send(err);
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

  app.get("/api/users", isLoggedIn, async (_, res) => {
    const { users, err } = await User.getAll();
    if (err) return res.status(500).send(err);
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

  app.get("/api/users/:id", isLoggedIn, async (req, res) => {
    const { params = {} } = req;
    const { user, err } = await User.getById(params.id);

    if (err) return res.status(500).send(err);
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

  app.get("/api/leaderboard", isLoggedIn, async (_, res) => {
    const { users, err } = await User.getAllOrderByXp();
    if (err) return res.status(500).send(err);
    return res.send(users.map(setProps(["lvl", "rank"])));
  });
};
