const express = require("express");
const router = express.Router();

const { getUnpaidJobs, payForJob } = require("@services/jobServices");
const { getProfile } = require('@middleware/getProfile');
const HttpStatusCodes = require("@constants/httpStatusCodes");

router.use(getProfile);
router.get('/unpaid', async (req, res) => {
    try {
        const jobs = await getUnpaidJobs(req.profile.id);
        res.status(HttpStatusCodes.OK).json({ success: true, jobs });
    } catch (error) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});


router.post("/:job_id/pay", async (req, res) => {
    try {
        const result = await payForJob(req.params.job_id, req.profile);
        res.status(HttpStatusCodes.ACCEPTED).json({ success: true, message: result });
    } catch (error) {
        console.error("Error in depositMoney:", error);
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        switch (error.message) {
            case "Job not found or already paid":
                statusCode = HttpStatusCodes.NOT_FOUND;
                break;
            case "Insufficient balance":
                statusCode = HttpStatusCodes.BAD_REQUEST;
                break;
        }
        return res.status(statusCode).json({ success: false, message: error.message });
    }
});

module.exports = router;
