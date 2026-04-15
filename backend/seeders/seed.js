const { seedCategories } = require("./CategorySeeder");
const { seedUsers } = require("./UserSeeder");

const seed = async () => {
    try {
        await seedCategories();
        await seedUsers();
    } catch (error) {
        console.log("Error seeding database! " + error);
    }

    process.exit();
};

seed();