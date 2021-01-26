const valid = ["rating", "comment"];
const keyValuePairs = require("../utils").keyValuePairs(valid);

module.exports = (db) => ({
  create: async (userId, { qrcode, ...qrshard }) => {
    const { keys, values, indices } = keyValuePairs(qrshard);
    const sql = `
        INSERT INTO qrshards ( ${keys}, user_id, qrspot_id ) 
        VALUES (${indices}, ${userId}, (SELECT id FROM qrspots WHERE qrcode = '${qrcode}'))
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
