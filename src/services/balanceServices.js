const { Job, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

const depositMoney = async (userId, amount) => {
    // Fetch the client profile
    const client = await Profile.findOne({
        where: { id: userId, type: "client" },
    });

    if (!client) {
        throw new Error("Client not found");
    }

    // Fetch unpaid jobs using a subquery to filter contracts
    const unpaidJobs = await Job.findAll({
        where: {
            paid: null,
            contractId: {
                [Op.in]: sequelize.literal(`
                    (SELECT id FROM Contracts WHERE clientId = ${client.id} AND status = 'in_progress')
                `),
            },
        },
    });

    const totalToPay = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
    const maxDeposit = totalToPay * 1.25;

    if (amount > maxDeposit) throw new Error("Exceeds maximum deposit limit");

    // Wrap only the balance increment in a transaction
    await sequelize.transaction(async (t) => {
        await client.increment({ balance: amount }, { transaction: t });
    });

    return "Deposit successfully";
};

module.exports = {
    depositMoney,
};
