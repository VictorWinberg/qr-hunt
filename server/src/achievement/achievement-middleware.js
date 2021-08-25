const achievements = require("./achievement-list");
const achievementsCal = require("./achievement-cal");
const { haveCalled } = require("../utils");

module.exports = ({ pg, db }) => async (req, res, next) => {
  var fnJson = res.json.bind(res);
  res.json = json => {
    res.body = json;
    fnJson.call(res, json);
  };

  res.on("finish", async () => {
    const { user = {} } = req;
    if (!req.isAuthenticated()) return;

    Object.entries(achievements).forEach(async ([key, fn]) => {
      let achievement = await fn({ key, pg, db, req, res });
      if (Array.isArray(achievement)) achievement = achievement.every(Boolean);

      if (achievement) {
        const sql = `
          INSERT INTO user_achievements (user_id, achievement_name) VALUES ($1, $2)
          ON CONFLICT DO NOTHING RETURNING *`;

        const { err } = await db.query(sql, [user.id, key]);
        if (err) console.error(err);
      }
    });

    const achievement = achievementsCal[new Date().toISOString().slice(5, 10)];
    if (haveCalled(req, res)("/api/qrshards", "POST")) {
      const sql = `
        INSERT INTO user_achievements (user_id, achievement_name) VALUES ($1, $2)
        ON CONFLICT DO NOTHING RETURNING *`;

      const { err } = await db.query(sql, [user.id, achievement]);
      if (err) console.error(err);
    }
  });

  const { method, url, user = {} } = req;
  switch (true) {
    case method === "GET" && Boolean(url.match("^/api/achievements/?$")): {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const sql = `
        SELECT achievement_name AS name, title, icon, score, level, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE popup = 't' AND user_id = $1`;

      const { rows: achievements, err } = await db.query(sql, [user.id]);
      if (err) return res.status(500).send(err);
      return res.send(achievements);
    }
    case method === "GET" && Boolean(url.match("^/api/achievements/new/?$")): {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const sql = `
        SELECT achievement_name AS name, title, icon, score, level, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE popup = 'f' AND user_id = $1 LIMIT 1`;

      const {
        rows: [achievement],
        err
      } = await db.query(sql, [user.id]);
      if (err) return res.status(500).send(err);
      if (!achievement) return res.sendStatus(200);
      return res.send(achievement);
    }
    case method === "POST" && Boolean(url.match("^/api/achievements/new/?$")): {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      const { name = "" } = req.body;

      const sql = `
        UPDATE user_achievements SET popup = 't'
        WHERE user_id = $1 AND achievement_name = $2
        RETURNING *`;

      const {
        rows: [achievement],
        err
      } = await db.query(sql, [user.id, name]);
      if (err) return res.status(500).send(err);
      if (!achievement) return res.sendStatus(404);
      return res.send(achievement);
    }
    case Boolean(url.match("^/api/achievements/.+/?$")): {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const name = req.url.match("^/api/achievements/(.+)/?$")[1];
      const sql = `
        SELECT achievement_name AS name, title, icon, score, level, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE user_id = $1 AND achievement_name = $2 LIMIT 1`;

      const {
        rows: [achievement],
        err
      } = await db.query(sql, [user.id, name.toUpperCase()]);
      if (err) return res.status(500).send(err);
      if (!achievement) return res.sendStatus(200);
      return res.send(achievement);
    }
  }

  return next();
};
