const express = require("express");
const router = express.Router();
const { getBestProfession, getBestClients } = require("../services/adminServices");
const { isValidDate, getISODateString } = require("../helpers");
router.get("/best-profession", async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!isValidDate(start) || !isValidDate(end)) {
            console.log(start, end);
            return res.status(400).json({ error: "Invalid date format. Please provide dates in DD-MM-YYYY format." });
        }
        const profession = await getBestProfession(getISODateString(start), getISODateString(end));
        res.json({ success: true, profession });
    } catch (error) {
        console.error("Error fetching best profession:", error);
        res.status(500).json({ succes: false, error: "Internal Server Error" });
    }
});

router.get("/best-clients", async (req, res) => {
    try {
        const { start, end, limit = 2 } = req.query;
        if (!isValidDate(start) || !isValidDate(end)) {
            return res.status(400).json({ error: "Invalid date format. Please provide dates in DD-MM-YYYY format." });
        }
        const clients = await getBestClients(getISODateString(start), getISODateString(end), limit);
        res.json({ success: true, clients });
    } catch (error) {
        console.error("Error fetching best clients:", error);
        res.status(500).json({ succes: false, error: "Internal Server Error" });
    }
});


module.exports = router;
