const { distance } = require("../utils");

const qr_spot_distance = 100; // in meters

module.exports = ({ app, db, isLoggedIn }) => {
  const QRShard = require("./qrshard-model")(db);
  const QRSpot = require("../qrspot/qrspot-model")(db);

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

  app.post("/api/qrshards", isLoggedIn, async (req, res, next) => {
    const { body, user = {} } = req;

    if (process.env.NODE_ENV === "production") {
      const { qrspot, err } = await QRSpot.getById(body.qrspot_id);
      if (err) return next(err);
      if (distance(body.user_coords, qrspot) > qr_spot_distance) {
        return res
          .status(403)
          .send(
            `Forbidden, distance to location is greater than ${qr_spot_distance}m`
          );
      }
    }

    const { qrshard, err } = await QRShard.create(user.id, body);
    if (err) return next(err);
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

  app.put("/api/qrshards/:id", isLoggedIn, async (req, res, next) => {
    const { params, body, user = {} } = req;
    const { qrshard, err } = await QRShard.update(user.id, params.id, body);
    if (err) return next(err);
    return res.send(qrshard);
  });
};
