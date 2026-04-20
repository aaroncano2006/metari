const { seedCategories } = require("./CategorySeeder");
const { seedUsers } = require("./UserSeeder");
const { seedInvitations } = require("./InvitationSeeder");
const { seedGroups } = require("./GroupSeeder");
const { seedMetas } = require("./MetaSeeder");
const { seedAssignations } = require("./AssignationSeeder");
const { seedProofs } = require("./ProofSeeder");
const { seedComments } = require("./CommentSeeder");
const { seedGroupsUsers } = require("./GroupUserSeeder");

const seed = async () => {
    try {
        await seedCategories();
        await seedUsers();
        await seedInvitations();
        await seedGroups();
        await seedMetas();
        await seedAssignations();
        await seedProofs();
        await seedComments();
        await seedGroupsUsers();
        
    } catch (error) {
        console.log("Error seeding database! " + error);
    }

    process.exit();
};

seed();