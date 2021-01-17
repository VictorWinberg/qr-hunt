module.exports = ({ app, pg, isLoggedIn }) => {
  const GeocacheCollected = require("../models/geocacheCollected")(pg);

  app.post('/api/geocaches_collected', (req, res) => {
    GeocacheCollected.create(req.body, (err, collectedGeocache) => {
      if (err) return res.status(400).send(err);
      return res.send(collectedGeocache);
    });
  });

  app.put('/api/geocaches_collected/:id', (req, res) => {
    GeocacheCollected.update(req.params.id, req.body, (err, collectedGeocache) => {
      if (err) return res.status(400).send(err);
      return res.send(collectedGeocache);
    });
  });
};
