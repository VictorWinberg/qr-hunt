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

const isToday = (date) => new Date(date).toDateString() === new Date().toDateString()

module.exports = { keyValuePairs, isLoggedIn, makeDbQuery, isToday };
