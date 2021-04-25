const { isToday } = require("../utils")

module.exports = ({ app, db, isLoggedIn }) => {
  const QRCode = require("../models/qrcode")(db);
  const QRSpot = require("../models/qrspot")(db);
  const QRShard = require("../models/qrshard")(db);

  /**
   * @swagger
   * /scan/{qrcode}:
   *   get:
   *     summary: Scan a QRCode
   *     tags:
   *       - Scan
   *     parameters:
   *       - in: path
   *         name: qrcode
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 qrcode:
   *                   $ref: '#/components/schemas/QRCode'
   *                 qrspot:
   *                   $ref: '#/components/schemas/QRSpot'
   *                 qrshard:
   *                   $ref: '#/components/schemas/QRShard'
   */

  app.get("/api/scan/:id", isLoggedIn, async (req, res) => {
    const { params, user = {} } = req;

    const results = await Promise.all([
      QRCode.getByUUID(params.id),
      QRSpot.getByQRCode(params.id),
      QRShard.getByQRCode(user.id, params.id),
    ]);

    const { err } = results.find(({ err }) => Boolean(err)) || {};
    if (err) return res.status(400).send(err);

    const [{ qrcode }, { qrspot }, { qrshard }] = results;
    return res.send({
      qrcode: qrcode || false,
      qrspot: qrspot || false,
      qrshard: qrshard || false,
      collectable: !qrshard || !isToday(qrshard.created_at)
    });
  });
};
