/**
 * @swagger
 * components:
 *   schemas:
 *     QRShard:
 *       properties:
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *         qrspot_id:
 *           type: integer
 */

const { keyValuePairs } = require("../utils");

module.exports = (db) => ({
  create: async (userId, qrshard) => {
    const valid = ["rating", "comment", "qrspot_id"];
    const { keys, values, indices } = keyValuePairs(valid, qrshard);
    const sql = `
        INSERT INTO qrshards ( ${keys.concat("user_id")} ) 
        VALUES (${indices.concat(userId)})
        RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { qrshard: rows[0], err };
  },

  update: async (userId, id, qrshard) => {
    const valid = ["rating", "comment"];
    const { keyIndices, values } = keyValuePairs(valid, qrshard);
    const sql = `
        UPDATE qrshards SET ${keyIndices}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { qrshard: rows[0], err };
  },

  getAll: async (userId) => {
    const sql = "SELECT * FROM qrshards WHERE user_id = $1";

    const { rows, err } = await db.query(sql, [userId]);
    return { qrshards: rows, err };
  },

  getByQRCode: async (userId, qrcode) => {
    const sql = `
        SELECT qrshards.* FROM qrshards
        JOIN qrspots ON qrshards.qrspot_id = qrspots.id
        WHERE user_id = $1 AND qrcode = $2
        ORDER BY qrshards.created_at DESC
        LIMIT 1`;

    const { rows, err } = await db.query(sql, [userId, qrcode]);
    return { qrshard: rows[0], err };
  },
});
