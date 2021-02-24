module.exports = (db) => ({
  create: async ({ name, email, photo }) => {
    const sql = `
        INSERT INTO users (name, email, photo)
        VALUES ($1, $2, $3) RETURNING *`;
    const { rows, err } = await db.query(sql, [name, email, photo]);
    return { user: rows[0], err };
  },

  getById: async (userId) => {
    const sql = `SELECT *,
      (SELECT COUNT(*) FROM qrshards WHERE user_id = id) AS qrshards_score,
      (SELECT COUNT(*) FROM user_achievements WHERE user_id = id) AS achievements_score
      FROM users WHERE id = $1`;

    const { rows, err } = await db.query(sql, [userId]);
    return { user: rows[0], err };
  },

  getByEmail: async (email) => {
    const sql = "SELECT * FROM users WHERE email = $1";
    const { rows, err } = await db.query(sql, [email]);
    return { user: rows[0], err };
  },

  getAll: async () => {
    const sql = `SELECT *,  
      (SELECT COUNT(*) FROM qrshards WHERE user_id = id) AS qrshards_score,
      (SELECT COUNT(*) FROM user_achievements WHERE user_id = id) AS achievements_score
      FROM users`;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  delete: async (id) => {
    const sql = "DELETE FROM users WHERE id = $1 RETURNING *";
    const { rows, err } = await db.query(sql, [id]);
    return { user: rows[0], err };
  },
});
