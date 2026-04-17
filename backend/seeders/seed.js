const { seedCategories } = require("./CategorySeeder");
const { seedUsers } = require("./UserSeeder");
const { seedGroups } = require("./GroupSeeder");
const { seedMetas } = require("./MetaSeeder");

const seed = async () => {
    try {
        await seedCategories();
        await seedUsers();
        await seedGroups();
        await seedMetas();
        
    } catch (error) {
        console.log("Error seeding database! " + error);
    }

    process.exit();
};

seed();