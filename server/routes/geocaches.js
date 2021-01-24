module.exports = ({ app, pg, isLoggedIn }) => {
  const Geocache = require("../models/geocache")(pg);

  app.get("/api/geocaches", (_, res) => {
    Geocache.getAll((err, geocaches) => {
      if (err) return res.status(400).send(err);
      return res.send(geocaches);
    });
  });

  app.post("/api/geocaches", isLoggedIn, (req, res) => {
    Geocache.create(req.body, (err, geocache) => {
      if (err) return res.status(400).send(err);
      return res.send(geocache);
    });
  });

  app.put("/api/geocaches/:id", isLoggedIn, (req, res) => {
    Geocache.update(req.params.id, req.body, (err, geocache) => {
      if (err) return res.status(400).send(err);
      return res.send(geocache);
    });
  });
};
