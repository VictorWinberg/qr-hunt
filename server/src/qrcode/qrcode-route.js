const { v4: uuidv4 } = require("uuid");

module.exports = ({ app, db, isLoggedIn, isAdmin }) => {
  const QRCode = require("./qrcode-model")(db);

  /**
   * @swagger
   * /qrcodes:
   *   get:
   *     summary: Retrieve a list of QRCodes
   *     tags:
   *       - QRCode
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/QRCode'
   *               minItems: 3
   */

  app.get("/api/qrcodes", isLoggedIn, isAdmin, async (_, res, next) => {
    const { qrcodes, err } = await QRCode.getAll();
    if (err) return next(err);
    return res.send(qrcodes);
  });

  /**
   * @swagger
   * /qrcodes:
   *   post:
   *     summary: Generate a new QRCode
   *     tags:
   *       - QRCode
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/QRCode'
   */

  app.post("/api/qrcodes", isLoggedIn, isAdmin, async (req, res, next) => {
    const { user = {} } = req;
    const { qrcode, err } = await QRCode.create(user.id, { uuid: uuidv4() });
    if (err) return next(err);
    return res.send(qrcode);
  });
};
