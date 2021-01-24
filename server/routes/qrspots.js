module.exports = ({ app, db, isLoggedIn }) => {
  const QRSpot = require("../models/qrspot")(db);

  app.get("/api/qrspots", async (_, res) => {
    const { qrspots, err } = await QRSpot.getAll();
    if (err) return res.status(400).send(err);
    return res.send(qrspots);
  });

  app.post("/api/qrspots", isLoggedIn, async (req, res) => {
    const { qrspot, err } = await QRSpot.create(req.body);
    if (err) return res.status(400).send(err);
    return res.send(qrspot);
  });

  app.put("/api/qrspots/:id", isLoggedIn, async (req, res) => {
    const { qrspot, err } = await QRSpot.update(req.params.id, req.body);
    if (err) return res.status(400).send(err);
    return res.send(qrspot);
  });
};
