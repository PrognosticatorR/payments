const { Contract } = require("@root/model");
const { Op } = require("sequelize");

const getContractById = async (id, profileId) => {
    const condition = {
        id,
        ClientId: profileId
    };
    return await Contract.findOne({ where: condition });
};

const getContracts = async profileId => {
    const condition = {
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        status: { [Op.ne]: "terminated" },
    };
    return await Contract.findAll({ where: condition });
};

module.exports = {
    getContractById,
    getContracts,
};
