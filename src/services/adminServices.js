const { Job, Contract, Profile, sequelize } = require("@root/model");
const { Op } = require("sequelize");

const getBestProfession = async (start, end) => {
    const bestProfession = await Job.findOne({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "total_earned"]],
        include: [
            {
                model: Contract,
                include: [
                    {
                        model: Profile,
                        as: "Contractor",
                        attributes: ["profession"],
                        where: { profession: { [Op.ne]: null } },
                    },
                ],
            },
        ],
        where: {
            paid: true,
            paymentDate: { [Op.between]: [new Date(start), new Date(end)] },
        },
        group: ["Contract.Contractor.profession"],
        order: [[sequelize.literal("total_earned"), "DESC"]],
        limit: 1,
    });

    return bestProfession ? bestProfession.Contract.Contractor.profession : "No data found";
};

const getBestClients = async (start, end, limit = 2) => {
    const bestClients = await Job.findAll({
        attributes: [
            [sequelize.literal("Contract.ClientId"), "id"],
            [sequelize.fn("sum", sequelize.col("price")), "paid"],
            [sequelize.literal("CONCAT(firstName, ' ', lastName)"), "fullName"],
        ],
        include: [
            {
                model: Contract,
                attributes: [],
                include: [
                    {
                        model: Profile,
                        as: "Client",
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
        where: {
            paid: true,
            paymentDate: { [Op.between]: [new Date(start), new Date(end)] },
        },
        group: ["Contract.ClientId"],
        order: [[sequelize.literal("paid"), "DESC"]],
        limit: parseInt(limit),
        raw: true,
    });

    return bestClients.map(client => ({
        id: client.id,
        fullName: client.fullName,
        paid: client.paid,
    }));
};

module.exports = {
    getBestProfession,
    getBestClients,
};
