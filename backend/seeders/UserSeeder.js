const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const seedUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    const overrideDB = false; 

    if (users.length > 0 && !overrideDB) {
        console.log("Existing Users found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.user.createMany({
      data: [
        {
          name: "Adria Borras",
          username: "Naimus",
          email: "naimus@test.com",
          password: await utils.hash("123456"),
          role: "admin",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Bruno Oro",
          username: "Yesi",
          email: "yesi@test.com",
          password: await utils.hash("123456"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Lucca",
          username: "Lucca",
          email: "lucca@test.com",
          password: await utils.hash("123456"),
          role: "user",
          completed_tasks: 5,
          score: 9001,
        },
        {
          name: "aaron",
          username: "aaron",
          email: "aaron@test.com",
          password: await utils.hash("123456"),
          role: "admin",
          completed_tasks: 0,
          score: 0,
        },
        
      ],
      skipDuplicates: true,
    });

    console.log("Usuaris seeded!");
  } catch (error) {
    console.log(`Error executant els seeders dels usuaris: ${error}`);
  }
};

module.exports = {
  seedUsers,
};
