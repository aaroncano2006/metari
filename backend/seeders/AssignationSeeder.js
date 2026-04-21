const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const seedAssignations = async () => {
  try {
    const assignations = await prisma.assignation.findMany();
    const overrideDB = true;

    if (assignations.length > 0 && !overrideDB) {
      console.log("Existing Assignations found! Aborting database seeding!");
      return;
    }

    const createMany = await prisma.assignation.createMany({
      data: [
        {
          group_id: 1,
          meta_id: 1,
          user_id: null,
          start_date: new Date("2026-01-01"),
          due_date: new Date("2026-01-10"),
          priority: "high",
          difficulty: "normal",
          score: 1000,
          completed: false,
        },   
        {
          group_id: null,
          meta_id: 2,
          user_id: 1,
          start_date: new Date("2026-01-01"),
          due_date: new Date("2026-01-10"),
          priority: "high",
          difficulty: "normal",
          score: 500,
          completed: false,
        },     
      ],
      skipDuplicates: true,
    });

    console.log("Assignations seeded!");
  } catch (error) {
    console.log(`Error executant els seeders de assignacions: ${error}`);
  }
};

module.exports = {
  seedAssignations,
};
