module.exports = db => ({
  create: async (userId, name) => {
    const sql = `
        BEGIN;

        UPDATE user_achievements
        SET count = user_achievements.count + 1, popup = 'f'
        FROM achievements
        WHERE (user_achievements.user_id, user_achievements.achievement_name, achievements.name) = (${userId}, '${name}', '${name}')
          AND repeatable IS NOT NULL
          AND to_char(updated_at, repeatable) != to_char(now(), repeatable);

        INSERT INTO user_achievements (user_id, achievement_name) VALUES (${userId}, '${name}')
        ON CONFLICT DO NOTHING;

        COMMIT;`;
    const { err } = await db.query(sql);
    return { err };
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
        WHERE user_id = $1`;

    const { rows, err } = await db.query(sql, [userId]);
    return { achievements: rows, err };
  }
});
