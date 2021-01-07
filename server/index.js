const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "..", "client", "dist")));

app.get("/api", (req, res) => res.send("API Running!"));

app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
