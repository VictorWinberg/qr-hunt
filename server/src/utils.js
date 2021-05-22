/** @type {typeof import("snakecase-keys").default} */
// @ts-ignore
const snakecaseKeys = require("snakecase-keys");
const camelcaseKeys = require("camelcase-keys");

const keyValuePairs = (valid, obj) => {
  const keys = Object.keys(obj).filter((key) => valid.includes(key));
  const values = keys.map((key) => obj[key]);
  const indices = keys.map((_, i) => `$${i + 1}`);
  const keyIndices = keys.map((key, i) => `${key} = $${i + 1}`);
  return { keys, values, indices, keyIndices };
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated() && process.env.NODE_ENV === "production") {
    return res.sendStatus(401);
  }
  return next();
};

const makeDbQuery = (pg) => async (query, values) => {
  try {
    const { rows } = await pg.query(query, values);
    return { rows };
  } catch ({ severity, message }) {
    return { rows: [], err: { query, severity, message } };
  }
};

const camelcaseMiddleware = options => [
  (_req, res, next) => {
    const send = res.send;
    res.send = function(body) {
      if (typeof body === "object" && body != null) {
        body = camelcaseKeys(body, options);
      }
      send.call(this, body);
      return res;
    };

    next();
  },
  (req, _res, next) => {
    req.body = snakecaseKeys(req.body, options);
    req.params = snakecaseKeys(req.params, options);
    req.query = snakecaseKeys(req.query, options);

    next();
  }
];

const isToday = (date) => new Date(date).toDateString() === new Date().toDateString()

module.exports = { keyValuePairs, isLoggedIn, makeDbQuery, isToday, camelcaseMiddleware };
