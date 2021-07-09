/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         photo:
 *           type: string
 */

module.exports = db => ({
  create: async ({ name, username, email, photo }) => {
    const sql = `
        INSERT INTO users (name, username, email, photo)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows, err } = await db.query(sql, [name, username, email, photo]);
    return { user: rows[0], err };
  },

  getById: async userId => {
    const sql = `SELECT *,
      (SELECT COUNT(*) FROM qrshards WHERE user_id = $1) AS qrshards_score,
      (SELECT COUNT(*) FROM user_achievements WHERE popup = 't' AND user_id = $1) AS achievements_score
      FROM users WHERE id = $1`;

    const { rows, err } = await db.query(sql, [userId]);
    return { user: rows[0], err };
  },

  getByEmail: async email => {
    const sql = "SELECT * FROM users WHERE email = $1";
    const { rows, err } = await db.query(sql, [email]);
    return { user: rows[0], err };
  },

  getAll: async () => {
    const sql = `SELECT users.*,
      COUNT(DISTINCT qrshards.id) AS qrshards_score,
      COUNT(DISTINCT (user_achievements.user_id, user_achievements.achievement_name)) AS achievements_score
      FROM users
      LEFT JOIN qrshards ON qrshards.user_id = users.id
      LEFT JOIN user_achievements ON user_achievements.user_id = users.id
      GROUP BY users.id
      `;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  delete: async id => {
    const sql = "DELETE FROM users WHERE id = $1 RETURNING *";
    const { rows, err } = await db.query(sql, [id]);
    return { user: rows[0], err };
  }
});
