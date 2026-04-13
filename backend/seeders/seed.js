const { seedCategories } = require("./CategoriesSeeder");

const seed = async () => {
    try {
        await seedCategories();
    } catch (error) {
        console.log("Error seeding database! " + error);
    }

    process.exit();
};

seed();