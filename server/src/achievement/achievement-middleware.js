const dayjs = require("dayjs");
const achievementsList = require("./achievement-list");
const achievementsCal = require("./achievement-cal");
const { haveCalled } = require("../utils");

module.exports = ({ app, pg, db }) => {
  const middleware = async (err, req, res, next) => {
    const Achievement = require("./achievement-model")(db);

    var fnJson = res.json.bind(res);
    res.json = json => {
      res.body = json;
      fnJson.call(res, json);
    };

    res.on("finish", async () => {
      const { user = {} } = req;
      if (!req.isAuthenticated()) return;

      Object.entries(achievementsList).forEach(async ([key, fn]) => {
        let achievement = await fn({ key, pg, db, err, req, res });
        if (Array.isArray(achievement))
          achievement = achievement.every(Boolean);

        if (achievement) {
          const { err } = await Achievement.create(user.id, key);
          if (err) console.error(err);
        }
      });

      const achievement = await achievementsCal(dayjs());
      if (achievement && haveCalled(req, res)("/api/qrshards", "POST")) {
        const { err } = await Achievement.create(user.id, achievement);
        if (err) console.error(err);
      }
    });

    const { method, url, user = {} } = req;
    switch (true) {
      case Boolean(url.match("^/api/achievements/?$")) && method === "GET": {
        if (!req.isAuthenticated()) return res.sendStatus(401);

        const { achievements, err } = await Achievement.getAll(user.id);

        if (err) return next(err);
        return res.send(achievements);
      }
      case Boolean(url.match("^/api/achievements/new/?$")) &&
        method === "GET": {
        if (!req.isAuthenticated()) return res.sendStatus(401);

        const { achievement, err } = await Achievement.getNew(user.id);

        if (err) return next(err);
        if (!achievement) return res.sendStatus(204);
        return res.send(achievement);
      }
      case Boolean(url.match("^/api/achievements/new/?$")) &&
        method === "PUT": {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const { name = "" } = req.body;

        const { achievement, err } = await Achievement.update(user.id, name);

        if (err) return next(err);
        if (!achievement) return res.sendStatus(404);
        return res.send(achievement);
      }
      case Boolean(url.match("^/api/achievements/.+/?$")): {
        if (!req.isAuthenticated()) return res.sendStatus(401);

        const name = req.url
          .match("^/api/achievements/(.+)/?$")[1]
          .toUpperCase();
        const { achievement, err } = await Achievement.getByName(user.id, name);

        if (err) return next(err);
        if (!achievement) return res.sendStatus(204);
        return res.send(achievement);
      }
      case Boolean(url.match("^/api/user_achievements/.+/?$")): {
        if (!req.isAuthenticated()) return res.sendStatus(401);

        const id = req.url.match("^/api/user_achievements/(.+)/?$")[1];
        const { achievements, err } = await Achievement.getAll(id);

        if (err) return next(err);
        return res.send(achievements);
      }
    }

    return next(err);
  };

  app.use((req, res, next) => middleware(null, req, res, next));
  app.use((err, req, res, next) => middleware(err, req, res, next));
};
