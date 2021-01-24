const valid = ["title", "lat", "lng", "note", "hint", "qrcode", "assigner_id"];
const keyValuePairs = require("../utils").keyValuePairs(valid);

module.exports = (db) => ({
  create: async (geocache) => {
    const { keys, values, indices } = keyValuePairs(geocache);
    const sql = `INSERT INTO geocaches ( ${keys} ) VALUES ( ${indices} ) RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { geocache: rows[0], err };
  },

  update: async (id, geocache) => {
    const { keyIndices, values } = keyValuePairs(geocache);
    const sql = `UPDATE geocaches SET ${keyIndices} WHERE id = ${id} RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { geocache: rows[0], err };
  },

  getAll: async () => {
    const sql = "SELECT * FROM geocaches";
    const { rows, err } = await db.query(sql);
    return { geocaches: rows, err };
  },

  getByQRCode: async (qrcode) => {
    const sql = "SELECT * FROM geocaches WHERE qrcode = $1";
    const { rows, err } = await db.query(sql, [qrcode]);
    return { geocache: rows[0], err };
  },
});
