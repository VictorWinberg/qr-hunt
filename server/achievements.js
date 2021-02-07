const achievements = {
  USER_HAS_SIGNED_UP: async ({ req }) => {
    return req.path === "/auth/google/callback" && req.user;
  },
  FIRST_QRSPOT_FOUND: async ({ req, res }) => {
    return (
      (req.route || {}).path === "/api/scan/:id" &&
      req.user &&
      (res.body || {}).qrspot
    );
  }
};

module.exports = ({ pg, db }) => async (req, res, next) => {
  var fnJson = res.json.bind(res);
  res.json = json => {
    res.body = json;
    fnJson.call(res, json);
  };

  res.on("finish", async () => {
    Object.entries(achievements).forEach(async ([key, fn]) => {
      if (await fn({ key, pg, db, req, res })) {
        const sql = `
          INSERT INTO user_achievements (user_id, achievement_name) VALUES ($1, $2)
          ON CONFLICT DO NOTHING RETURNING *`;

        const { err } = await db.query(sql, [req.user.id, key]);
        if (err) console.error(err);
      }
    });
  });

  if (req.url === "/api/achievements") {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const sql = `
        SELECT achievement_name as name, title, icon, score, level, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE user_id = $1`;

    const { rows: achievements, err } = await db.query(sql, [req.user.id]);
    if (err) return res.status(400).send(err);
    return res.send(achievements);
  }

  return next();
};
