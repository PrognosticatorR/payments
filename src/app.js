const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const balanceRoutes = require('./routes/balanceRoutes');
const contractRoutes = require("./routes/contractRoutes");
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();

// Middleware
app.use(bodyParser.json());

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
