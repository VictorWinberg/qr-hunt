const { v4: uuidv4 } = require("uuid");

module.exports = ({ app, db, isLoggedIn }) => {
  const QRCode = require("../models/qrcode")(db);

  app.get("/api/qrcodes", isLoggedIn, async (_, res) => {
    const { qrcodes, err } = await QRCode.getAll();
    if (err) return res.status(400).send(err);
    return res.send(qrcodes);
  });

  app.post("/api/qrcodes", isLoggedIn, async (_, res) => {
    const { qrcode, err } = await QRCode.create({ uuid: uuidv4() });
    if (err) return res.status(400).send(err);
    return res.send(qrcode);
  });
};
