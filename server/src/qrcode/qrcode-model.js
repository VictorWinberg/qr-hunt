/**
 * @swagger
 * components:
 *   schemas:
 *     QRCode:
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         owner_id:
 *           type: integer
 */

module.exports = (db) => ({
  create: async (ownerId, { uuid }) => {
    const sql = "INSERT INTO qrcodes (uuid, owner_id) VALUES ($1, $2) RETURNING *";
    const { rows, err } = await db.query(sql, [uuid, ownerId]);
    return { qrcode: rows[0], err };
  },

  getAll: async () => {
    const sql = "SELECT * FROM qrcodes";
    const { rows, err } = await db.query(sql);
    return { qrcodes: rows, err };
  },

  getByUUID: async (uuid) => {
    const sql = "SELECT * FROM qrcodes WHERE uuid = $1 LIMIT 1";
    const { rows, err } = await db.query(sql, [uuid]);
    return { qrcode: rows[0], err };
  },
});
