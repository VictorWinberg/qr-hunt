module.exports = ({ app, db, isLoggedIn }) => {
  const GeocacheCollected = require("../models/geocacheCollected")(db);

  app.post("/api/geocaches_collected", isLoggedIn, async (req, res) => {
    const { geocache, err } = await GeocacheCollected.create(
      req.user.id,
      req.body
    );
    if (err) return res.status(400).send(err);
    return res.send(geocache);
  });

  app.put("/api/geocaches_collected/:id", isLoggedIn, async (req, res) => {
    const { geocache, err } = await GeocacheCollected.update(
      req.user.id,
      req.params.id,
      req.body
    );
    if (err) return res.status(400).send(err);
    return res.send(geocache);
  });
};
