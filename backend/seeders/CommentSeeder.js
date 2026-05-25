const prisma = require("../config/prisma");

const seedComments = async () => {
  try {
    const comments = await prisma.comment.findMany();
    const overrideDB = false;

    if (comments.length > 0 && !overrideDB) {
      console.log("Existing Comments found! Aborting database seeding!");
      return;
    }

    const createMany = await prisma.comment.createMany({
      data: [
        {
          assignation_id:1,
          user_id: 1,
          body: "avui tambe??? :'(",
        },
        {
          assignation_id:2,
          user_id: 2,
          body: "Esteu tots d'acord a fer aixo...?",
        },  
        {
          assignation_id:6,
          user_id: 1,
          body: "Genial!! Jo m'apunto!",
        },      
      ],
      skipDuplicates: true,
    });

    console.log("Comments seeded!");
  } catch (error) {
    console.log(`Error executant els seeders de comments: ${error}`);
  }
};

module.exports = {
seedComments,
};