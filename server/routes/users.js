module.exports = ({ app, pg, isLoggedIn }) => {
  const User = require("../models/user")(pg);

  app.get("/api/user", (req, res) => {
    res.send(req.user || {});
  });

  app.delete("/api/user", isLoggedIn, (req, res) => {
    User.delete(req.user.id, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) return res.sendStatus(404);
      return res.send(user);
    });
  });

  app.get("/api/users", isLoggedIn, (_, res) => {
    User.getAll((err, users) => {
      if (err) return res.status(400).send(err);
      return res.send(users);
    });
  });

  app.get("/api/users/:id", isLoggedIn, (req, res) => {
    User.getById(req.params.id, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) return res.sendStatus(404);
      return res.send(user);
    });
  });
};
