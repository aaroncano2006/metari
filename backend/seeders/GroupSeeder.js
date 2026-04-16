const prisma = require("../config/prisma");

const seedGroups = async () => {
  try {
    const groups = await prisma.group.findMany();
    const overrideDB = false; 

    if (groups.length > 0 && !overrideDB) {
        console.log("Existing Users found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.group.createMany({
      data: [
        {
          name: "Los pelaos",
          description: "Grup per fer tests",
          owner_id: 3,
          is_public:false,
        },
        {
          name: "Los flipaos",
          description: "Grup 2 per fer tests",
          owner_id: 2,
          is_public:false,
        },
        {
          name: "Coleguis",
          description: "Grup 3 per fer tests",
          owner_id: 3,
          is_public:true,
        },
      ],
      skipDuplicates: true,
    });

    console.log("Grups seeded!");
  } catch (error) {
    console.log(`Error executant els seeders dels grups: ${error}`);
  }
};

module.exports = {
  seedGroups,
};
