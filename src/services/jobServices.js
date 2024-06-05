const { Job, Contract, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

const getUnpaidJobs = async (profileId) => {
    return await Job.findAll({
        include: [
            {
                model: Contract,
                where: {
                    status: { [Op.ne]: "terminated" },
                    [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
                },
            },
        ],
        where: { paid: null },
    })
};

const payForJob = async (jobId, profile) => {
    const job = await Job.findOne({
        where: { id: jobId },
        include: [
            {
                model: Contract,
                where: { ClientId: profile.id },
                include: [
                    { model: Profile, as: "Client" },
                    { model: Profile, as: "Contractor" },
                ],
            },
        ],
    });

    if (!job || job.paid) throw new Error("Job not found or already paid");

    const { Client: client, Contractor: contractor } = job.Contract;

    if (client.balance < job.price) throw new Error("Insufficient balance");

    try {
        await sequelize.transaction(async t => {
            await Promise.all([
                client.decrement({ balance: job.price }, { transaction: t }),
                contractor.increment({ balance: job.price }, { transaction: t }),
                job.update({ paid: true, paymentDate: new Date() }, { transaction: t }),
            ]);
        });

        return "Payment successful";
    } catch (error) {
        console.error("Error in payForJob:", error);
        throw new Error(error.message);
    }
};

module.exports = {
    getUnpaidJobs,
    payForJob,
};
