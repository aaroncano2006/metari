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
          password: await utils.hash("12345678"),
          role: "admin",
          completed_tasks: 13,
          score: 500,
        },
        {
          name: "Bruno Oro",
          username: "Yesiiii",
          email: "yesi@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Lucca",
          username: "Lucca",
          email: "lucca@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 5,
          score: 9001,
        },
        {
          name: "aaron",
          username: "aaron",
          email: "aaron@test.com",
          password: await utils.hash("12345678"),
          role: "admin",
          completed_tasks: 50,
          score: 99,
        },
        {
          name: "Romà Bejar",
          username: "Romàno",
          email: "roma@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 2,
          score: 20,
        },
        {
          name: "Jordi Selga",
          username: "JSelga",
          email: "selga@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Oscar",
          username: "Oscarcillo",
          email: "oscar@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Adnan",
          username: "Adnan",
          email: "adnan@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Javier",
          username: "Javichu",
          email: "adnan@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "David Pascual",
          username: "Paski",
          email: "david@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Aitor",
          username: "Aitorcillo",
          email: "david@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Arnau",
          username: "Gitachito",
          email: "arnau@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Ivan Fernandez",
          username: "IvanDestructor",
          email: "Ivan@test.com",
          password: await utils.hash("12345678"),
          role: "user",
          completed_tasks: 0,
          score: 0,
        },
        {
          name: "Nom Alumne",
          username: "Alumne",
          email: "presentacio@test.com",
          password: await utils.hash("12345678"),
          role: "user",
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
