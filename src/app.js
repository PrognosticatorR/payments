const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const balanceRoutes = require('./routes/balanceRoutes');

dotenv.config();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/admin", adminRoutes);
app.use("/balances", balanceRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

module.exports = app;
