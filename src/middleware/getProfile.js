const { Profile } = require("../model");
const getProfile = async (req, res, next) => {
    console.log(req.get("profile_id"));
    const profile = await Profile.findOne({ where: { id: req.get("profile_id") || 0 } });
    if (!profile) return res.status(401).send({ success: false, message: "Not Authorized" });
    req.profile = profile;
    next();
};
module.exports = { getProfile };
