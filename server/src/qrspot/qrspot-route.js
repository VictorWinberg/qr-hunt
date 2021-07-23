module.exports = ({ app, db, isLoggedIn }) => {
  const QRSpot = require("./qrspot-model")(db);

  /**
   * @swagger
   * /qrspots:
   *   get:
   *     summary: Retrieve a list of QRSpots
   *     tags:
   *       - QRSpot
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/QRSpot'
   *               minItems: 2
   */

  app.get("/api/qrspots", async (req, res) => {
    const { user = {} } = req;
    const { qrspots, err } = await QRSpot.getAll(user.id);
    if (err) return res.status(400).send(err);
    return res.send(qrspots);
  });

  /**
   * @swagger
   * /qrspots:
   *   post:
   *     summary: Create a new QRSpot
   *     tags:
   *       - QRSpot
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QRSpot'
   */

  app.post("/api/qrspots", isLoggedIn, async (req, res) => {
    const { body, user = {} } = req;
    const { qrspot, err } = await QRSpot.create(user.id, body);
    if (err) return res.status(400).send(err);
    return res.send(qrspot);
  });

  /**
   * @swagger
   * /qrspots/{id}:
   *   put:
   *     summary: Update a QRSpot
   *     tags:
   *       - QRSpot
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
   *               $ref: '#/components/schemas/QRSpot'
   */

  app.put("/api/qrspots/:id", isLoggedIn, async (req, res) => {
    const { params, body, user = {} } = req;
    const { qrspot, err } = await QRSpot.update(user.id, params.id, body);
    if (err) return res.status(400).send(err);
    if (!qrspot) return res.sendStatus(403);
    return res.send(qrspot);
  });

  /**
   * @swagger
   * /qrspots/{id}:
   *   delete:
   *     summary: Delete a QRSpot
   *     tags:
   *       - QRSpot
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   */

  app.delete("/api/qrspots/:id", isLoggedIn, async (req, res) => {
    const { params, user = {} } = req;
    const { qrspot, err } = await QRSpot.deactivate(user.id, params.id);
    console.log(qrspot, err);
    if (err) return res.status(400).send(err);
    if (!qrspot) return res.sendStatus(403);
    return res.send(qrspot);
  });
};
