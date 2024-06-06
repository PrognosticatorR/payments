const express = require("express");
const router = express.Router();

const { getProfile } = require("@middleware/getProfile");
const { getContractById, getContracts } = require("@services/contractServices");
const HttpStatusCodes = require("@constants/httpStatusCodes");

router.use(getProfile);

router.get("/:id", async (req, res) => {
    try {
        const contracts = await getContractById(req.params.id, req.profile.id);
        res.status(HttpStatusCodes.OK).json({ success: true, contracts: contracts ?? [] });
    } catch (error) {
        console.error("Error fetching contract:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const contracts = await getContracts(req.profile.id);
        res.status(HttpStatusCodes.OK).json({ success: true, contracts });
    } catch (error) {
        console.error("Error fetching contracts:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
