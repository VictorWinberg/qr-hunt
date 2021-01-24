const valid = ["score", "comment"];
const keyValuePairs = require("../utils").keyValuePairs(valid);

module.exports = (db) => ({
  create: async (userId, { qrcode, ...collectedGeocache }) => {
    const { keys, values, indices } = keyValuePairs(collectedGeocache);
    const sql = `
        INSERT INTO geocaches_collected ( ${keys}, user_id, geocache_id ) 
        VALUES (${indices}, ${userId}, (SELECT id FROM geocaches WHERE qrcode = '${qrcode}'))
        RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { geocache: rows[0], err };
  },

  update: async (userId, id, collectedGeocache) => {
    const { keyIndices, values } = keyValuePairs(collectedGeocache);
    const sql = `
        UPDATE geocaches_collected SET ${keyIndices}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { geocache: rows[0], err };
  },

  getAll: async (userId) => {
    const sql = "SELECT * FROM geocaches_collected WHERE user_id = $1";

    const { rows, err } = await db.query(sql, [userId]);
    return { geocaches: rows, err };
  },

  getByQRCode: async (userId, qrcode) => {
    const sql = `
        SELECT * FROM geocaches_collected
        WHERE user_id = $1 AND qrcode = $2`;

    const { rows, err } = await db.query(sql, [userId, qrcode]);
    return { geocache: rows[0], err };
  },
});
