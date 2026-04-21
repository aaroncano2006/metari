const prisma = require("../config/prisma");

const seedMetas = async () => {
  try {
    const metas = await prisma.meta.findMany();
    const overrideDB = false; 

    if (metas.length > 0 && !overrideDB) {
        console.log("Existing Metas found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.meta.createMany({
      data: [
        {
          title:"Fer el llit",
          description:"Fes el llit, al mati",
          author_id:2,
          group_id:2,
        },
        {
          title:"Captura un Picachu",
          description:"A la versio red/Blue",
          author_id:3,
          group_id:2,
          type:"challenge",
        },
        {
          title:"Acabar Seeders",
          description:"Fer tots els seeders de metari",
          author_id:1,
          group_id:2,
        },
        
        
      ],
      skipDuplicates: true,
    });

    console.log("Metas seeded!");
  } catch (error) {
    console.log(`Error executant els seeders de les metes: ${error}`);
  }
};

module.exports = {
  seedMetas,
};
