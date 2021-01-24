module.exports = ({ app, db, isLoggedIn }) => {
  const Geocache = require("../models/geocache")(db);

  app.get("/api/geocaches", async (_, res) => {
    const { geocaches, err } = await Geocache.getAll();
    if (err) return res.status(400).send(err);
    return res.send(geocaches);
  });

  app.post("/api/geocaches", isLoggedIn, async (req, res) => {
    const { geocache, err } = await Geocache.create(req.body);
    if (err) return res.status(400).send(err);
    return res.send(geocache);
  });

  app.put("/api/geocaches/:id", isLoggedIn, async (req, res) => {
    const { geocache, err } = await Geocache.update(req.params.id, req.body);
    if (err) return res.status(400).send(err);
    return res.send(geocache);
  });
};
