module.exports = ({ app, db, isLoggedIn }) => {
  const User = require("./user-model")(db);

  const setProps = keys => ({
    qrshards_score = 0,
    achievements_score = 0,
    ...user
  }) => {
    let props = {};
    props.isAuthenticated = true;
    props.xp = Number(qrshards_score) + Number(achievements_score) * 5;
    props.lvl = Math.floor(Math.sqrt(props.xp));
    props.lvlXp = props.xp - Math.pow(props.lvl, 2);
    props.reqLvlXp = Math.pow(props.lvl + 1, 2) - Math.pow(props.lvl, 2);

    keys.forEach(key => (user[key] = props[key]));

    return user;
  };

  app.get("/api/user", (req, res) => {
    const { user } = req;
    if (!req.isAuthenticated()) return res.send({ isAuthenticated: false });

    return res.send(
      setProps(["isAuthenticated", "xp", "lvl", "lvlXp", "reqLvlXp"])(user)
    );
  });

  app.delete("/api/user", isLoggedIn, async (req, res) => {
    const { user, err } = await User.delete(req.user.id);
    if (err) return res.status(400).send(err);
    if (!user) return res.sendStatus(404);
    return res.send(user);
  });

  app.get("/api/users", isLoggedIn, async (_, res) => {
    const { users, err } = await User.getAll();
    if (err) return res.status(400).send(err);
    return res.send(users.map(setProps(["lvl"])));
  });

  app.get("/api/users/:id", isLoggedIn, async (req, res) => {
    const { user, err } = await User.getById(req.params.id);
    if (err) return res.status(400).send(err);
    if (!user) return res.sendStatus(404);
    return res.send(setProps(["lvl"])(user));
  });
};
