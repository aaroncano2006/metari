const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const seedProofs = async () => {
  try {
    const proofs = await prisma.proof.findMany();
    const overrideDB = false;

    if (proofs.length > 0 && !overrideDB) {
      console.log("Existing Proofs found! Aborting database seeding!");
      return;
    }

    const createMany = await prisma.proof.createMany({
      data: [
        {
          assignation_id: 1,
          user_id: 1,
          proof: "Screenshot o text de la prova",
          is_valid: true,
        },
        {
          assignation_id: 2,
          user_id: 1,
          proof: "Prova resposta",
          is_valid: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log("Proofs seeded!");
  } catch (error) {
    console.log(`Error executant els seeders de proofs: ${error}`);
  }
};

module.exports = {
  seedProofs,
};