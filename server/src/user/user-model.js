/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         photo:
 *           type: string
 */

const { keyValuePairs } = require("../utils");

const SELECT_QR_SHARDS_SQL = where => `
  SELECT users.id, CAST(COUNT(qrshards.*) AS int) AS qrshards_score
  FROM users
  LEFT JOIN qrshards ON qrshards.user_id = users.id
  WHERE ${where || "true"}
  GROUP BY users.id
`;

const SELECT_ACHIEVEMENTS_SQL = where => `
  SELECT users.id, CAST(SUM(user_achievements.count * achievements.score) AS int) AS achievements_score
  FROM users
  LEFT JOIN user_achievements ON user_achievements.user_id = users.id
  LEFT JOIN achievements ON achievements.name = user_achievements.achievement_name
  WHERE popup = 't' AND ${where || "true"}
  GROUP BY users.id
`;

const SELECT_DISTINCT_QRSHARDS_SQL = () => `
  SELECT DISTINCT(created_at::date) AS created_at, user_id
  FROM qrshards
`;

const SELECT_LAST_GAP_SQL = () => `
  SELECT DISTINCT ON (users.id) d.d AS last_date, users.id AS user_id
  FROM generate_series('2020-01-01', CURRENT_DATE - interval '1 day', '1 day') d(d)
  CROSS JOIN users
  LEFT OUTER JOIN user_shards ON user_shards.created_at = d.d::date AND user_shards.user_id = users.id
  WHERE user_shards.created_at IS NULL
  ORDER BY users.id, d.d DESC
`;

const SELECT_STREAK_SQL = () => `
  SELECT CAST(COUNT(*) AS int) AS streak, user_id AS id
  FROM user_shards
  JOIN last_gap USING(user_id)
  WHERE created_at > last_date
  GROUP BY user_id
`;

const SELECT_USERS_SQL = args => `
  SELECT id, username, name, email, photo, locale, is_admin, created_at ${args}
  FROM users
`;

const SELECT_USERS_SQL_FULL = `
  WITH qrshards_count AS (
    ${SELECT_QR_SHARDS_SQL()}
  ), achievements_count AS (
    ${SELECT_ACHIEVEMENTS_SQL()}
  ), user_shards AS (
    ${SELECT_DISTINCT_QRSHARDS_SQL()}
  ), last_gap AS (
    ${SELECT_LAST_GAP_SQL()}
  ), streak_count AS (
    ${SELECT_STREAK_SQL()}
  )

  ${SELECT_USERS_SQL(
    `, COALESCE(streak, 0) AS streak, CAST(COALESCE(qrshards_score + achievements_score, 0) AS int) AS xp`
  )}
  LEFT JOIN qrshards_count USING (id)
  LEFT JOIN achievements_count USING (id)
  LEFT JOIN streak_count USING (id)
`;

const SELECT_USERS_SQL_DATE = (from, to) => `
  WITH qrshards_count AS (
    ${SELECT_QR_SHARDS_SQL()}
  ), achievements_count AS (
    ${SELECT_ACHIEVEMENTS_SQL()}
  ), qrshards_date_count AS (
    ${SELECT_QR_SHARDS_SQL(
      `qrshards.created_at >= '${from}' AND qrshards.created_at < '${to}'`
    )}
  )

  ${SELECT_USERS_SQL(`, qrshards_date_count.qrshards_score AS score,
    qrshards_count.qrshards_score + achievements_score AS xp`)}
  LEFT JOIN qrshards_count USING (id)
  LEFT JOIN achievements_count USING (id)
  LEFT JOIN qrshards_date_count USING (id)
  WHERE qrshards_date_count.qrshards_score IS NOT NULL
`;

module.exports = db => ({
  create: async ({ username, name, email, photo }) => {
    const sql = `
        INSERT INTO users (username, name, email, photo)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows, err } = await db.query(sql, [username, name, email, photo]);
    return { user: rows[0], err };
  },

  update: async (id, user) => {
    const valid = ["name", "photo", "locale"];
    const { keyIndices, values } = keyValuePairs(valid, user);
    const sql = `
        UPDATE users SET ${keyIndices}
        WHERE id = ${id} RETURNING *`;

    const { rows, err } = await db.query(sql, values);
    return { user: rows[0], err };
  },

  getById: async userId => {
    const sql = `${SELECT_USERS_SQL_FULL}
        WHERE id = $1 LIMIT 1`;
    const { rows, err } = await db.query(sql, [userId]);
    return { user: rows[0], err };
  },

  getByEmail: async email => {
    const sql = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const { rows, err } = await db.query(sql, [email]);
    return { user: rows[0], err };
  },

  getAll: async () => {
    const sql = `${SELECT_USERS_SQL_FULL}
        ORDER BY name, username, id`;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  getAllOrderByXp: async () => {
    const sql = `${SELECT_USERS_SQL_FULL}
        ORDER BY xp DESC, name, username, id`;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  getAllScoreDate: async (from, to) => {
    const sql = `${SELECT_USERS_SQL_DATE(from, to)}
        ORDER BY score DESC, name, username, id`;
    const { rows, err } = await db.query(sql);
    return { users: rows, err };
  },

  getAllShardDate: async (from, to) => {
    const sql = `SELECT qrshards.id, qrshards.created_at, user_id, lat, lng
      FROM qrshards
      LEFT JOIN qrspots ON qrspot_id = qrspots.id
      LEFT JOIN users ON user_id = users.id
      WHERE qrshards.created_at >= '${from}' AND qrshards.created_at < '${to}'
      ORDER BY user_id, qrshards.created_at`;
    const { rows, err } = await db.query(sql);
    return { shards: rows, err };
  },

  delete: async id => {
    const sql = "DELETE FROM users WHERE id = $1 RETURNING *";
    const { rows, err } = await db.query(sql, [id]);
    return { user: rows[0], err };
  }
});
