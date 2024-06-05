const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const { depositMoney } = require("../services/balanceServices");
const _ = require("lodash");


router.post("/deposit/:userId", async (req, res) => {
    try {
        if (!_.isInteger(req.body.amount)) {
            return res.status(400).json({ message: 'amount must be an integer' })
        }
        const result = await depositMoney(req.params.userId, req.body.amount);
        return res.status(200).json({ message: result, success: true });
    } catch (error) {
        console.error("Error in depositMoney:", error);
        let statusCode = 500;
        switch (error.message) {
            case "Client not found":
                statusCode = 404;
                break;
            case "Exceeds maximum deposit limit":
                statusCode = 400;
                break;
        }
        return res.status(statusCode).json({ success: false, message: error.message });
    }
});

module.exports = router;
