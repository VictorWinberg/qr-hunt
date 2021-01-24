const express = require("express");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { Client: PGClient } = require("pg");
const passport = require("passport");

const achievements = require("./achievements");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const { PORT, DATABASE_URL, SESSION_SECRET_KEY1, SESSION_SECRET_KEY2 } = process.env;

const app = express();

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        name: "session",
        keys: [SESSION_SECRET_KEY1, SESSION_SECRET_KEY2],
        // Cookie Options
        httpOnly: true,
        resave: false,
        rolling: true,
        saveUninitialized: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // one month
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
require('./passport')(passport, pg);

// helpers
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated() && NODE_ENV === "production") {
    return res.sendStatus(401);
  }
  return next();
};
const props = { app, passport, pg, isLoggedIn };

// achievements
app.use(achievements(props));

// routes
require('./routes/auth')(props);
require('./routes/geocaches')(props);
require('./routes/geocachesCollected')(props);
require('./routes/qrcodes')(props);
require('./routes/users')(props);

app.listen(PORT || 3000, () => console.log(`App running on port ${PORT || 3000}!`));
