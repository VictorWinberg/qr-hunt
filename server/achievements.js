const achievements = {
  USER_HAS_SIGNED_UP: async ({ key, db, req }) => {
    if (req.path !== "/auth/google/callback" || !req.user) return;
    const query = await db(
      `INSERT INTO user_achievements (user_id, achievement_name) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING *`,
      [req.user.id, key]
    );
    if (query.err) console.error(query.err);
  },
};

module.exports = ({ pg }) => async (req, res, next) => {
  const db = async (query, values) => {
    try {
      const { rows } = await pg.query(query, values);
      return { rows };
    } catch ({ severity, message }) {
      return { err: { query, severity, message } };
    }
  };

  if (req.url === "/api/achievements") {
    if (!req.isAuthenticated()) res.sendStatus(401);

    const achievements = await db(
      `SELECT achievement_name as name, title, score, level, user_achievements.created_at
       FROM user_achievements
       FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
       WHERE user_id = $1`,
      [req.user.id]
    );
    if (achievements.err) res.status(400).send(achievements.err);
    res.send(achievements.rows);
  }

  var fnJson = res.json.bind(res);
  res.json = (json) => {
    res.body = json;
    fnJson.call(res, json);
  };

  res.on("finish", async () => {
    Object.entries(achievements).forEach(([key, fn]) =>
      fn({ key, pg, db, req, res })
    );
  });

  return next();
};
