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

module.exports = db => ({
  create: async ({ username, name, email, photo }) => {
    const sql = `
        INSERT INTO users (username, name, email, photo)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows, err } = await db.query(sql, [username, name, email, photo]);
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
    const sql = `
      WITH qrshards_count AS (
        SELECT users.id, COUNT(qrshards.*) AS qrshards_score
        FROM users
        LEFT JOIN qrshards ON qrshards.user_id = users.id
        GROUP BY users.id
      ), achievements_count AS (
        SELECT users.id, COUNT(user_achievements.*) AS achievements_score
        FROM users
        LEFT JOIN user_achievements ON user_achievements.user_id = users.id
        GROUP BY users.id
      ) 

      SELECT * FROM users
      JOIN qrshards_count USING (id) 
      JOIN achievements_count USING (id)
      ORDER BY name, username, users.id
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
