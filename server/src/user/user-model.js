/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         photo:
 *           type: string
 */

const SELECT_USERS_SQL = `
  WITH qrshards_count AS (
    SELECT users.id, CAST(COUNT(qrshards.*) AS int) AS qrshards_score
    FROM users
    LEFT JOIN qrshards ON qrshards.user_id = users.id
    GROUP BY users.id
  ), achievements_count AS (
    SELECT users.id, CAST(COUNT(user_achievements.*) AS int) AS achievements_score
    FROM users
    LEFT JOIN user_achievements ON user_achievements.user_id = users.id
    WHERE popup = 't'
    GROUP BY users.id
  )

  SELECT id, username, name, email, photo, created_at,
    CAST(COALESCE(qrshards_score + achievements_score * 5, 0) AS int) AS xp
  FROM users
  LEFT JOIN qrshards_count USING (id)
  LEFT JOIN achievements_count USING (id)
`;

module.exports = db => ({
  create: async ({ username, name, email, photo }) => {
    const sql = `
        INSERT INTO users (username, name, email, photo)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows, err } = await db.query(sql, [username, name, email, photo]);
    return { user: rows[0], err };
  },

  getById: async userId => {
    const sql = `${SELECT_USERS_SQL}
        WHERE id = $1`;
    const { rows, err } = await db.query(sql, [userId]);
    return { user: rows[0], err };
  },

  getByEmail: async email => {
    const sql = "SELECT * FROM users WHERE email = $1";
    const { rows, err } = await db.query(sql, [email]);
    return { user: rows[0], err };
  },

  getAll: async () => {
    const sql = `${SELECT_USERS_SQL}
        ORDER BY name, username, id`;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  getAllByXp: async () => {
    const sql = `${SELECT_USERS_SQL}
        ORDER BY xp DESC, name, username, id`;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  delete: async id => {
    const sql = "DELETE FROM users WHERE id = $1 RETURNING *";
    const { rows, err } = await db.query(sql, [id]);
    return { user: rows[0], err };
  }
});
