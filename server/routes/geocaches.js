module.exports = ({ app, pg, isLoggedIn }) => {
  const Geocache = require("../models/geocache")(pg);

  app.get("/__/geocaches", (_, res) => {
    Geocache.getAll((err, geocaches) => {
      if (err) return res.status(400).send(err);
      return res.send(geocaches);
    });
  });

  app.post("/__/geocaches", (req, res) => {
    Geocache.create(req.body, (err, geocache) => {
      if (err) return res.status(400).send(err);
      return res.send(geocache);
    });
  });

  app.put("/__/geocaches/:id", (req, res) => {
    Geocache.update(req.params.id, req.body, (err, geocache) => {
      if (err) return res.status(400).send(err);
      return res.send(geocache);
    });
  });
};
