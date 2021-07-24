const achievements = {
  USER_HAS_SIGNED_UP: ({ req }) => {
    return req.path === "/auth/google/callback";
  },
  THANKFUL: ({ req }) => {
    return [
      req.method === "POST",
      req.path.toLowerCase() === "/api/achievements/thankful"
    ];
  },
  FIRST_QRSPOT_FOUND: ({ req, res }) => {
    return [
      (req.route || {}).path === "/api/scan/:id",
      (res.body || {}).qrspot
    ];
  },
  QR_CODE_NOT_FOUND: ({ req, res }) => {
    return [
      (req.route || {}).path === "/api/scan/:id",
      !(res.body || {}).qrcode
    ];
  },
  FIRST_QRSPOT_CREATED: ({ req, res }) => {
    return [
      req.method === "POST",
      req.path.toLowerCase() === "/api/qrspots",
      res.statusCode === 200
    ];
  },
  COLLECT_THREE_IN_DAY: ({ req }) => {
    return false;
  },
  COLLECT_MANY_IN_DAY: ({ req }) => {
    return false;
  },
  COLLECT_AT_MORNING: ({ req, res }) => {
    const hours = new Date().getHours();
    return [
      hours >= 3 && hours < 6,
      req.method === "POST",
      req.path.toLowerCase() === "/api/qrshards",
      res.statusCode === 200
    ];
  },
  COLLECT_AT_NIGHT: ({ req, res }) => {
    const hours = new Date().getHours();
    return [
      hours >= 22 && hours < 3,
      req.method === "POST",
      req.path.toLowerCase() === "/api/qrshards",
      res.statusCode === 200
    ];
  },
  FIRST_RECOLLECT: ({ req }) => {
    return false;
  },
  FIRST_HINT_USED: ({ req }) => {
    return false;
  }
};

module.exports = ({ pg, db }) => async (req, res, next) => {
  var fnJson = res.json.bind(res);
  res.json = json => {
    res.body = json;
    fnJson.call(res, json);
  };

  res.on("finish", async () => {
    if (!req.isAuthenticated()) return;

    Object.entries(achievements).forEach(async ([key, fn]) => {
      let achievement = await fn({ key, pg, db, req, res });
      if (Array.isArray(achievement)) achievement = achievement.every(Boolean);

      if (achievement) {
        const sql = `
          INSERT INTO user_achievements (user_id, achievement_name) VALUES ($1, $2)
          ON CONFLICT DO NOTHING RETURNING *`;

        const { err } = await db.query(sql, [req.user.id, key]);
        if (err) console.error(err);
      }
    });
  });

  const { method, url } = req;
  switch (true) {
    case method === "GET" && Boolean(url.match("^/api/achievements/?$")): {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const sql = `
        SELECT achievement_name AS name, title, icon, score, level, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE popup = 't' AND user_id = $1`;

      const { rows: achievements, err } = await db.query(sql, [req.user.id]);
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
      } = await db.query(sql, [req.user.id]);
      if (err) return res.status(500).send(err);
      if (!achievement) return res.sendStatus(204);
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
      } = await db.query(sql, [req.user.id, name]);
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
      } = await db.query(sql, [req.user.id, name.toUpperCase()]);
      if (err) return res.status(500).send(err);
      if (!achievement) return res.sendStatus(204);
      return res.send(achievement);
    }
  }

  return next();
};
