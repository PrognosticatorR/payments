const express = require("express");
const router = express.Router();
const { getUnpaidJobs, payForJob } = require("../services/jobServices");
const { getProfile } = require('../middleware/getProfile');
const { sanitizeResponse } = require('../helpers')

router.use(getProfile);
router.get('/unpaid', async (req, res) => {
    try {
        const jobs = await getUnpaidJobs();
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post("/:job_id/pay", async (req, res) => {
    try {
        const result = await payForJob(req.params.job_id, req.profile);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error("Error in depositMoney:", error);
        let statusCode = 500;
        switch (error.message) {
            case "Job not found or already paid":
                statusCode = 404;
                break;
            case "Insufficient balance":
                statusCode = 400;
                break;
        }
        return res.status(statusCode).json({ success: false, message: error.message });
    }
});

module.exports = router;
