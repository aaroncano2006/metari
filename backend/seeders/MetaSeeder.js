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
          category_id: 2,
          author_id:2,
          group_id:2,
        },
        {
          title:"Captura un Pikachu shiny",
          description:"A la versio red/Blue",
          category_id: 7,
          author_id:3,
          group_id:2,
          type:"challenge"

        },
        {
          title:"Acabar deures de mates",
          description:"Fer els deures",
          category_id: 3,
          author_id:1,
          group_id:2,
        },
        {
          title:"Caminar 5 km",
          description:"",
          category_id: 5,
          author_id:1,
          group_id:2,
        },
        {
          title:"Fer una partida al Monopoly",
          description:"",
          category_id: 6,
          author_id:1,
          group_id:2,
        },
        {
          title:"Fer una partida al Catan",
          description:"",
          category_id: 6,
          author_id:1,
          group_id:2,
        },
        {
          title:"Fer una partida al Carcassonne",
          description:"",
          category_id: 6,
          author_id:1,
          group_id:2,
        },
        {
          title:"Passar l'aspirador",
          description:"plis...",
          category_id: 2,
          author_id:2,
          group_id:2,
        },
        {
          title:"Fer campana",
          description:"no fa mal a ningu ;)",
          category_id: 8,
          author_id:2,
          group_id:2,
          type:"challenge"
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
