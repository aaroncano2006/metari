const { seedCategories } = require("./CategorySeeder");
const { seedUsers } = require("./UserSeeder");
const { seedInvitations } = require("./InvitationSeeder");

const seed = async () => {
    try {
        await seedCategories();
        await seedUsers();
        await seedInvitations();
    } catch (error) {
        console.log("Error seeding database! " + error);
    }

    process.exit();
};

seed();