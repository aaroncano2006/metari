const prisma = require("../config/prisma");

const seedIndexedMetas = async () => {
  try {
    const indexedMetas = await prisma.indexedMeta.findMany();
    const overrideDB = false; 

    if (indexedMetas.length > 0 && !overrideDB) {
        console.log("Existing IndexedMetas found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.indexedMeta.createMany({
      data: [
        {
          meta_id:1,
          group_id:1,
          is_public:true,
        },
        {
          user_id:1,
          meta_id:2,
          is_public:false,
        },
        {
          user_id:4,
          meta_id:3,
          is_public:true,
        },
      ],
      skipDuplicates: true,
    });

    console.log("IndexedMetas seeded!");
  } catch (error) {
    console.log(`Error executant els seeders d'IndexedMetas: ${error}`);
  }
};

module.exports = {
  seedIndexedMetas,
};
