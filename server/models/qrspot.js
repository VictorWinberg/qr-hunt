/**
 * @swagger
 * components:
 *   schemas:
 *     QRSpot:
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 *         note:
 *           type: string
 *         hint:
 *           type: string
 *         score:
 *           type: integer
 *         qrcode:
 *           type: string
 *           format: uuid
 *         assigner_id:
 *           type: integer
 */

const valid = ["title", "lat", "lng", "note", "hint", "score", "qrcode", "assigner_id"];
const keyValuePairs = require("../utils").keyValuePairs(valid);

module.exports = (db) => ({
  create: async (qrspot) => {
    const { keys, values, indices } = keyValuePairs(qrspot);
    const sql = `INSERT INTO qrspots ( ${keys} ) VALUES ( ${indices} ) RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { qrspot: rows[0], err };
  },

  update: async (id, qrspot) => {
    const { keyIndices, values } = keyValuePairs(qrspot);
    const sql = `UPDATE qrspots SET ${keyIndices} WHERE id = ${id} RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { qrspot: rows[0], err };
  },

  getAll: async () => {
    const sql = "SELECT * FROM qrspots";
    const { rows, err } = await db.query(sql);
    return { qrspots: rows, err };
  },

  getByQRCode: async (qrcode) => {
    const sql = "SELECT * FROM qrspots WHERE qrcode = $1";
    const { rows, err } = await db.query(sql, [qrcode]);
    return { qrspot: rows[0], err };
  },
});
