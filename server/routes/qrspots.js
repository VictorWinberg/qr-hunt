module.exports = ({ app, db, isLoggedIn }) => {
  const QRSpot = require("../models/qrspot")(db);


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
  
  app.get("/api/qrspots", async (_, res) => {
    const { qrspots, err } = await QRSpot.getAll();
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
    const { qrspot, err } = await QRSpot.create(req.body);
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
    const { qrspot, err } = await QRSpot.update(req.params.id, req.body);
    if (err) return res.status(400).send(err);
    return res.send(qrspot);
  });
};
