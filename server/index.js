const express = require("express");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const { Client: PGClient } = require("pg");
const passport = require("passport");

const swagger = require("./swagger");
const sentry = require("./sentry");
const utils = require("./src/utils");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const {
  PORT,
  DATABASE_URL,
  SESSION_SECRET_KEY1,
  SESSION_SECRET_KEY2
} = process.env;

const app = express();

sentry.init(app);
sentry.beforeHandlers(app);

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(utils.camelcaseMiddleware({ deep: true }));
app.use(
  session({
    name: "session",
    keys: [SESSION_SECRET_KEY1, SESSION_SECRET_KEY2],
    // Cookie Options
    httpOnly: true,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    maxAge: 30 * 24 * 60 * 60 * 1000 // one month
  })
);
app.use(passport.initialize());
app.use(passport.session());

// serve static client build
app.use(express.static(path.resolve(__dirname, "..", "client", "dist")));

// connect to our database
const pg = new PGClient(DATABASE_URL);
pg.connect();

// authentication
require("./passport")(passport, pg);

// route-props
const props = {
  app,
  passport,
  pg,
  db: { query: utils.makeDbQuery(pg) },
  isLoggedIn: utils.isLoggedIn,
  isAdmin: utils.isAdmin
};

// achievements
app.use(require("./src/achievement/achievement-middleware")(props));

// routes
require("./src/auth/auth")(props);
require("./src/qrspot/qrspot-route")(props);
require("./src/qrshard/qrshard-route")(props);
require("./src/qrcode/qrcode-route")(props);
require("./src/scan/scan-route")(props);
require("./src/user/user-route")(props);

// swagger
swagger(app);

app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  if (err) throw new Error(err);
  next();
});

sentry.afterHandlers(app);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(PORT || 3000, () =>
  console.log(`App running on port ${PORT || 3000}!`)
);
