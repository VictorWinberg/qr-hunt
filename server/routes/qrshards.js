module.exports = ({ app, db, isLoggedIn }) => {
  const QRShard = require("../models/qrshard")(db);

  app.post("/api/qrshards", isLoggedIn, async (req, res) => {
    const { qrshard, err } = await QRShard.create(req.user.id, req.body);
    if (err) return res.status(400).send(err);
    return res.send(qrshard);
  });

  app.put("/api/qrshards/:id", isLoggedIn, async (req, res) => {
    const { qrshard, err } = await QRShard.update(
      req.user.id,
      req.params.id,
      req.body
    );
    if (err) return res.status(400).send(err);
    return res.send(qrshard);
  });
};
