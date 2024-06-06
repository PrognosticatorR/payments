const express = require("express");
const router = express.Router();
const { getBestProfession, getBestClients } = require("@services/adminServices");
const { isValidDate, getISODateString } = require("@utils/helpers");
const HttpStatusCodes = require("@constants/httpStatusCodes");
router.get("/best-profession", async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!isValidDate(start) || !isValidDate(end)) {
            console.log(start, end);
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false, error: "Invalid date format. Please provide dates in DD-MM-YYYY format." });
        }
        const profession = await getBestProfession(getISODateString(start), getISODateString(end));
        res.json({ success: true, profession });
    } catch (error) {
        console.error("Error fetching best profession:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ succes: false, error: "Internal Server Error" });
    }
});

router.get("/best-clients", async (req, res) => {
    try {
        const { start, end, limit = 2 } = req.query;
        if (!isValidDate(start) || !isValidDate(end)) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false, error: "Invalid date format. Please provide dates in DD-MM-YYYY format." });
        }
        const clients = await getBestClients(getISODateString(start), getISODateString(end), limit);
        res.json({ success: true, clients });
    } catch (error) {
        console.error("Error fetching best clients:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ succes: false, error: "Internal Server Error" });
    }
});


module.exports = router;
