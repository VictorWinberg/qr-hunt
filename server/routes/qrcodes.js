const { v4: uuidv4 } = require("uuid");

module.exports = ({ app, pg, isLoggedIn }) => {
  const QRCode = require("../models/qrcode")(pg);

  app.get("/__/qrcodes", (_, res) => {
    QRCode.getAll((err, qrcodes) => {
      if (err) return res.status(400).send(err);
      return res.send(qrcodes);
    });
  });

  app.post("/__/qrcodes", (_, res) => {
    QRCode.create({ uuid: uuidv4() }, (err, qrcode) => {
      if (err) return res.status(400).send(err);
      return res.send(qrcode);
    });
  });
};
