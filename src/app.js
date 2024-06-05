const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());

module.exports = app;
