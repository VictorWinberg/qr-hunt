module.exports = ({ app, db, isLoggedIn }) => {
  const QRShard = require("../models/qrshard")(db);

  app.post("/api/qrshards", isLoggedIn, async (req, res) => {
    const { body, user = {} } = req;
    const { qrshard, err } = await QRShard.create(user.id, body);
    if (err) return res.status(400).send(err);
    return res.send(qrshard);
  });

  app.put("/api/qrshards/:id", isLoggedIn, async (req, res) => {
    const { params, body, user = {} } = req;
    const { qrshard, err } = await QRShard.update(user.id, params.id, body);
    if (err) return res.status(400).send(err);
    return res.send(qrshard);
  });
};
