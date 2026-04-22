const prisma = require("../config/prisma");

const seedCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    const overrideDB = false; 


    if (categories.length > 0  && !overrideDB) {
        console.log("Existing Categories found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.category.createMany({
      data: [
        {
          name: "Tecnologia",
          description:
            "Categoria sobre tecnologia. Involucra temes com informática, IA, electrònica i altres.",
        },
        {
          name: "Llar",
          description: "Categoria relativa a les tasques de la llar.",
        },
        {
            name: "Matemàtiques",
            description: "Categoria relativa a metes amb temàtica de mates.",
        },
      ],
      skipDuplicates: true,
    });

    console.log("Categories seeded!");
  } catch (error) {
    console.log(`Error executant els seeders: ${error}`);
  }
};

module.exports = {
  seedCategories,
};
