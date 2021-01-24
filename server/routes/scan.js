module.exports = ({ app, pg, db, isLoggedIn }) => {
  const QRCode = require("../models/qrcode")(db);
  const QRSpot = require("../models/qrspot")(db);
  const QRShard = require("../models/qrshard")(db);

  app.get("/api/scan/:id", isLoggedIn, async (req, res) => {
    const { params, user = {} } = req;

    const { qrcode, err: codeErr } = await QRCode.getByUUID(params.id);
    if (codeErr) return res.status(400).send(codeErr);

    const { qrspot, err: spotErr } = await QRSpot.getByQRCode(params.id);
    if (spotErr) return res.status(400).send(spotErr);

    const { qrshard, err: shardErr } = await QRShard.getByQRCode(
      user.id,
      params.id
    );
    if (shardErr) return res.status(400).send(shardErr);

    return res.send({ qrcode: qrcode, qrspot: qrspot, qrshard: qrshard });
  });
};
