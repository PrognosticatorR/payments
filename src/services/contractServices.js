const { Contract } = require("../model");
const { Op } = require("sequelize");

const getContractById = async (id, profileId) => {
    const condition = {
        id,
        [Op.and]: [{ ClientId: profileId }],
    };
    return await Contract.findOne({ where: condition });
};

const getContracts = async profileId => {
    const condition = {
        ClientId: profileId,
        status: { [Op.ne]: "terminated" },
    };
    return await Contract.findAll({ where: condition });
};

module.exports = {
    getContractById,
    getContracts,
};
