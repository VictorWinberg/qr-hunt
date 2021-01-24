module.exports = ({ app, db, isLoggedIn }) => {
  const User = require("../models/user")(db);

  app.get("/api/user", (req, res) => {
    res.send(req.user || {});
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
    return res.send(users);
  });

  app.get("/api/users/:id", isLoggedIn, async (req, res) => {
    const { user, err } = await User.getById(req.params.id);
    if (err) return res.status(400).send(err);
    if (!user) return res.sendStatus(404);
    return res.send(user);
  });
};
