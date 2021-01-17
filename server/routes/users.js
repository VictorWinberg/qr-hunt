module.exports = ({ app, pg }) => {
  const User = require("../models/user")(pg);

  app.get("/api/user", (req, res) => {
    res.send(req.user || {});
  });

  app.get("/api/users/:id", (req, res) => {
    User.getById(req.params.id, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) return res.sendStatus(404);
      return res.send(user);
    });
  });

  app.delete('/api/users/:id', (req, res) => {
    User.delete(req.params.id, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) return res.sendStatus(404);
      return res.send(user);
    });
  });
};
