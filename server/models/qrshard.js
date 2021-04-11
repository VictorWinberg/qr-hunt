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

const valid = ["rating", "comment", "qrspot_id"];
const keyValuePairs = require("../utils").keyValuePairs(valid);

module.exports = (db) => ({
  create: async (userId, qrshard) => {
    const { keys, values, indices } = keyValuePairs(qrshard);
    const sql = `
        INSERT INTO qrshards ( ${keys.concat("user_id")} ) 
        VALUES (${indices.concat(userId)})
        RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { qrshard: rows[0], err };
  },

  update: async (userId, id, qrshard) => {
    const { keyIndices, values } = keyValuePairs(qrshard);
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
        SELECT * FROM qrshards
        JOIN qrspots ON qrshards.qrspot_id = qrspots.id
        WHERE user_id = $1 AND qrcode = $2`;

    const { rows, err } = await db.query(sql, [userId, qrcode]);
    return { qrshard: rows[0], err };
  },
});
