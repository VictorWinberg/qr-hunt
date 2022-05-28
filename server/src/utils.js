/** @type {typeof import("snakecase-keys").default} */
// @ts-ignore
const snakecaseKeys = require("snakecase-keys");
const camelcaseKeys = require("camelcase-keys");

function pascalCase(str) {
  return str.replace(
    /(\w)(\w*)/g,
    (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
  );
}

function keyValuePairs(valid, obj) {
  const keys = Object.keys(obj).filter(key => valid.includes(key));
  const values = keys.map(key => obj[key]);
  const indices = keys.map((_, i) => `$${i + 1}`);
  const keyIndices = keys.map((key, i) => `${key} = $${i + 1}`);
  return { keys, values, indices, keyIndices };
}

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated() && process.env.NODE_ENV === "production") {
    return res.sendStatus(401);
  }
  return next();
}

const makeDbQuery = pg => async (query, values) => {
  try {
    const { rows } = await pg.query(query, values);
    return { rows };
  } catch ({ severity, message }) {
    return {
      rows: [],
      err: `Database ${pascalCase(
        severity
      )}: ${message}\n in query: ${query}\n with values: ${values}`
    };
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

const isToday = date =>
  new Date(date).toDateString() === new Date().toDateString();

function distance({ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }) {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 0;

  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

const haveCalled = (req, res) => (url, method = "GET", status = 200) =>
  [
    ((req.route || {}).path || req.path) === url,
    req.method === method,
    res.statusCode === status
  ].every(Boolean);

function isValidDate(str) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!str.match(regEx)) return false; // Invalid format
  var d = new Date(str);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === str;
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

const chaining = (...fns) => {
  return fns.reduceRight(
    (res, fn) => fn(res),
    a => a
  );
};

const mapValues = cb => obj => {
  return Object.entries(obj).reduce((res, [key, val]) => {
    return { ...res, [key]: cb(val) };
  }, {});
};

const sumValues = () => values => {
  return Object.values(values).reduce((res, value) => res + value, 0);
};

module.exports = {
  keyValuePairs,
  isLoggedIn,
  makeDbQuery,
  isToday,
  camelcaseMiddleware,
  distance,
  haveCalled,
  isValidDate,
  groupBy,
  chaining,
  mapValues,
  sumValues
};
