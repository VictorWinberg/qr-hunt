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
 *         owner_id:
 *           type: integer
 */

const { keyValuePairs } = require("../utils");

module.exports = db => ({
  create: async (userId, qrspot) => {
    const valid = [
      "title",
      "lat",
      "lng",
      "note",
      "hint",
      "score",
      "qrcode",
      "owner_id"
    ];
    const { keys, values, indices } = keyValuePairs(valid, {
      ...qrspot,
      owner_id: userId
    });
    const sql = `INSERT INTO qrspots ( ${keys} ) VALUES ( ${indices} )
      RETURNING *, owner_id = ${userId} AS is_owner`;

    const { rows, err } = await db.query(sql, values);
    return { qrspot: rows[0], err };
  },

  update: async (user, id, qrspot) => {
    const valid = ["qrcode", "title", "lat", "lng", "note", "hint", "missing"];
    const { keyIndices, values } = keyValuePairs(valid, qrspot);
    const sql = `
      UPDATE qrspots SET ${keyIndices}
      WHERE id = ${id} AND (owner_id = ${user.id} OR ${user.is_admin} = true)
      RETURNING *, owner_id = ${user.id} AS is_owner`;

    const { rows, err } = await db.query(sql, values);
    return { qrspot: rows[0], err };
  },

  deactivate: async (user, id) => {
    const sql = `
      UPDATE qrspots SET active = FALSE, qrcode = NULL
      WHERE id = ${id} AND (owner_id = ${user.id} OR ${user.is_admin} = true)
      RETURNING *`;

    const { rows, err } = await db.query(sql);
    return { qrspot: rows[0], err };
  },

  getAll: async userId => {
    const sql = `
      WITH qrshards_last AS (
        SELECT DISTINCT ON (qrspot_id)
          qrspot_id, created_at AS last_visited_at
        FROM qrshards
        WHERE user_id != $1
        ORDER BY qrspot_id, created_at DESC
      )

      SELECT DISTINCT ON (qrspots.id)
        qrspots.*, owner_id = user_id AS is_owner,
        qrshards.created_at AS collected_at,
        last_visited_at
      FROM qrspots
      LEFT JOIN qrshards ON qrspots.id = qrshards.qrspot_id AND user_id = $1
      LEFT JOIN qrshards_last ON qrspots.id = qrshards_last.qrspot_id
      WHERE active = TRUE
      ORDER BY qrspots.id, qrshards.created_at DESC`;

    const { rows, err } = await db.query(sql, [userId]);
    return { qrspots: rows, err };
  },

  getById: async id => {
    const sql = "SELECT * FROM qrspots WHERE id = $1 AND active = TRUE LIMIT 1";
    const { rows, err } = await db.query(sql, [id]);
    return { qrspot: rows[0], err };
  },

  getByQRCode: async qrcode => {
    const sql =
      "SELECT * FROM qrspots WHERE qrcode = $1 AND active = TRUE LIMIT 1";
    const { rows, err } = await db.query(sql, [qrcode]);
    return { qrspot: rows[0], err };
  }
});
