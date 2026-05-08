const prisma = require("../config/prisma");

const seedCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    const overrideDB = false;


    if (categories.length > 0 && !overrideDB) {
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
          description: "Categoria relacionada a les tasques de la llar.",
        },
        {
          name: "Matemàtiques",
          description: "Categoria amb temàtica de matemàtiques.",
        },
        {
          name: "Esports",
          description: "Categoria relacionada a activitats esportives.",
        },
        {
          name: "Exercici Fisic",
          description: "Categoria relacionada a activitats fisiques.",
        },
        {
          name: "Jocs de taula",
          description: "Categoria relacionada amb jocs de taula.",
        },
        {
          name: "Videojocs",
          description: "Categoria relacionada amb Videojocs.",
        },
        {
          name: "Estudis",
          description: "Categoria relacionada amb els estudis.",
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
