const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/admin", adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

module.exports = app;
