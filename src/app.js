const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
require('module-alias/register');

const adminRoutes = require("@routes/adminRoutes");
const balanceRoutes = require('@routes/balanceRoutes');
const contractRoutes = require("@routes/contractRoutes");
const jobRoutes = require("@routes/jobRoutes");

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json({ limit: '5mb' })); // Set JSON body limit to 5 mb
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(helmet());
app.use(compression());
app.use(cors({ origin: ["http://localhost:3001"] }));

// Routes
app.use("/admin", adminRoutes);
app.use("/balances", balanceRoutes);
app.use("/contracts", contractRoutes);
app.use("/jobs", jobRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

module.exports = app;
