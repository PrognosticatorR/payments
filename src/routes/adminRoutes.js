const express = require("express");
const router = express.Router();
const { getBestProfession, getBestClients } = require("../services/adminServices");
const moment = require("moment");
router.get("/best-profession", async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!isValidDate(start) || !isValidDate(end)) {
            console.log(start, end);
            return res.status(400).json({ error: "Invalid date format. Please provide dates in DD-MM-YYYY format." });
        }
        // Convert local strings to UTC format
        const startUTC = moment.utc(start, "DD-MM-YYYY").toISOString();
        const endUTC = moment.utc(end, "DD-MM-YYYY").toISOString();
        // Call the function with UTC dates
        const profession = await getBestProfession(startUTC, endUTC);
        res.json({ profession });
    } catch (error) {
        console.error("Error fetching best profession:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/best-clients", async (req, res) => {
    try {
        const { start, end, limit = 2 } = req.query;
        if (!isValidDate(start) || !isValidDate(end)) {
            return res.status(400).json({ error: "Invalid date format. Please provide dates in DD-MM-YYYY format." });
        }
        // Convert local strings to UTC format
        const startUTC = moment.utc(start, "DD-MM-YYYY").toISOString();
        const endUTC = moment.utc(end, "DD-MM-YYYY").toISOString();
        const clients = await getBestClients(startUTC, endUTC, limit);
        res.json(clients);
    } catch (error) {
        console.error("Error fetching best clients:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

function isValidDate(dateString) {
    return moment(dateString, "DD-MM-YYYY", true).isValid();
}

module.exports = router;
