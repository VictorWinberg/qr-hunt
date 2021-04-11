module.exports = ({ app, db, isLoggedIn }) => {
  const QRShard = require("../models/qrshard")(db);

  /**
   * @swagger
   * /qrshards:
   *   post:
   *     summary: Create a new QRShard
   *     tags:
   *       - QRShard
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QRShard'
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/QRShard'
   */

  app.post("/api/qrshards", isLoggedIn, async (req, res) => {
    const { body, user = {} } = req;
    console.log(body);
    const { qrshard, err } = await QRShard.create(user.id, body);
    if (err) return res.status(400).send(err);
    return res.send(qrshard);
  });

  /**
   * @swagger
   * /qrshards/{id}:
   *   put:
   *     summary: Update a QRShard
   *     tags:
   *       - QRShard
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rating:
   *                 type: integer
   *               comment:
   *                 type: string
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/QRShard'
   */

  app.put("/api/qrshards/:id", isLoggedIn, async (req, res) => {
    const { params, body, user = {} } = req;
    const { qrshard, err } = await QRShard.update(user.id, params.id, body);
    if (err) return res.status(400).send(err);
    return res.send(qrshard);
  });
};
