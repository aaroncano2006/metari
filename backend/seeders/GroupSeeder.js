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
          name: "Programadors S.L",
          description: "Grup de programadors",
          owner_id: 8,
          is_public:true,
        },
        {
          name: "Los Pelaos",
          description: "Grup d'amics",
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
          description: "Grup dels 3 penjats",
          owner_id: 3,
          is_public:true,
        },
        {
          name: "Cool Family",
          description: "Grup de la familia guai",
          owner_id: 7,
          is_public:true,
        },
        {
          name: "Grup Presentacio",
          description: "Grup per la presentacio del projecte",
          owner_id: 12,
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
