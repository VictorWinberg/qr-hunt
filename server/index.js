const express = require("express");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const pg = require("pg");
const passport = require("passport");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const PORT = process.env.PORT || 3000;

const app = express();

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET_KEY1, process.env.SESSION_SECRET_KEY2],
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
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

// load models
// TODO: Add models

// authentication
// TODO: Add authentication

// routes
// TODO: Add routes

app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
