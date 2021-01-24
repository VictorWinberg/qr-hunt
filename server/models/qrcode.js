module.exports = (db) => ({
  create: async ({ uuid }) => {
    const sql = "INSERT INTO qrcodes (uuid) VALUES ($1) RETURNING *";
    const { rows, err } = await db.query(sql, [uuid]);
    return { qrcode: rows[0], err };
  },

  getAll: async () => {
    const sql = "SELECT * FROM qrcodes";
    const { rows, err } = await db.query(sql);
    return { qrcodes: rows, err };
  },

  getByUUID: async (uuid) => {
    const sql = "SELECT * FROM qrcodes WHERE uuid = $1";
    const { rows, err } = await db.query(sql, [uuid]);
    return { qrcode: rows[0], err };
  },
});
