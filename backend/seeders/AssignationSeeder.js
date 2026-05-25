const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const seedAssignations = async () => {
  try {
    const assignations = await prisma.assignation.findMany();
    const overrideDB = false;

    if (assignations.length > 0 && !overrideDB) {
      console.log("Existing Assignations found! Aborting database seeding!");
      return;
    }

    const createMany = await prisma.assignation.createMany({
      data: [
        {
          group_id: 1,
          meta_id: 1,
          user_id: 1,
          start_date: new Date("2026-01-01"),
          due_date: new Date("2026-01-10"),
          priority: "high",
          difficulty: "normal",
          score: 1000,
          completed: false,
        },   
        {
          group_id: null,
          meta_id: 3,
          user_id: 1,
          start_date: new Date("2026-01-01"),
          due_date: new Date("2026-01-10"),
          priority: "high",
          difficulty: "normal",
          score: 500,
          completed: false,
        }, 
        {
          group_id: null,
          meta_id: 4,
          user_id: 1,
          start_date: new Date("2026-05-20"),
          due_date: new Date("2026-05-21"),
          priority: "high",
          difficulty: "normal",
        },   
        {
          group_id: null,
          meta_id: 5,
          user_id: 12,
          start_date: new Date("2026-01-01"),
          due_date: null,
          priority: null,
          difficulty: "normal",
          score: null,
          completed: false,
        },  
        {
          group_id: 6,
          meta_id: 3,
          user_id: null,
          start_date: new Date("2026-05-25"),
          due_date: null,
          priority: null,
          difficulty: "normal",
          score: null,
          completed: false,
          assigner_id:1,
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
