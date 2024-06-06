const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { depositMoney } = require("@services/balanceServices");
const HttpStatusCodes = require("@constants/httpStatusCodes");


router.post("/deposit/:userId", async (req, res) => {
    try {
        const amount = req.body.amount;
        if (!_.isInteger(req.body.amount) || amount <= 0) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'amount must be an integer or greater then 0' })
        }
        const result = await depositMoney(req.params.userId, req.body.amount);
        return res.status(200).json({ message: result, success: true });
    } catch (error) {
        console.error("Error in depositMoney:", error);
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        switch (error.message) {
            case "Client not found":
                statusCode = HttpStatusCodes.NOT_FOUND;
                break;
            case "Exceeds maximum deposit limit":
                statusCode = HttpStatusCodes.BAD_REQUEST;
                break;
        }
        return res.status(statusCode).json({ success: false, message: error.message });
    }
});

module.exports = router;
