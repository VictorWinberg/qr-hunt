module.exports = db => ({
  create: async (userId, name) => {
    const sql = `
        WITH new_achievement AS (
          INSERT INTO user_achievements (user_id, achievement_name) VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          RETURNING *
        )

        UPDATE user_achievements
        SET count = user_achievements.count + 1, popup = 'f'
        FROM achievements
        WHERE (user_achievements.user_id, user_achievements.achievement_name, achievements.name) = ($1, $2, $2)
          AND repeatable IS NOT NULL
          AND to_char(updated_at, repeatable) != to_char(now(), repeatable)
        RETURNING *`;
    const { rows, err } = await db.query(sql, [userId, name]);
    return { achievement: rows[0], err };
  },

  update: async (userId, name) => {
    const sql = `
        UPDATE user_achievements SET popup = 't'
        WHERE user_id = $1 AND achievement_name = $2
        RETURNING *`;

    const { rows, err } = await db.query(sql, [userId, name]);
    return { achievement: rows[0], err };
  },

  getByName: async (userId, name) => {
    const sql = `
        SELECT achievement_name AS name, title, icon, score, count, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE user_id = $1 AND achievement_name = $2
        LIMIT 1`;

    const { rows, err } = await db.query(sql, [userId, name]);
    return { achievement: rows[0], err };
  },

  getNew: async userId => {
    const sql = `
        SELECT achievement_name AS name, title, icon, score, count, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE popup = 'f' AND user_id = $1
        LIMIT 1`;

    const { rows, err } = await db.query(sql, [userId]);
    return { achievement: rows[0], err };
  },

  getAll: async userId => {
    const sql = `
        SELECT achievement_name AS name, title, icon, score, count, user_achievements.created_at
        FROM user_achievements
        FULL JOIN achievements ON user_achievements.achievement_name = achievements.name
        WHERE popup = 't' AND user_id = $1`;

    const { rows, err } = await db.query(sql, [userId]);
    return { achievements: rows, err };
  }
});
