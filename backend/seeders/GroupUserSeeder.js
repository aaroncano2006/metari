const prisma = require("../config/prisma");

const seedGroupsUsers = async () => {
  try {
    const groupsUsers = await prisma.groupUser.findMany();
    const overrideDB = false; 

    if (groupsUsers.length > 0 && !overrideDB) {
        console.log("Existing GroupsUsers found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.groupUser.createMany({
      data: [
        {
          user_id:1,          
          group_id:1,
        },
        {
          user_id:2,          
          group_id:1,
          role:"moderator",
        },
        {
          user_id:1,          
          group_id:2,
        },
        {
          user_id:2,          
          group_id:3,
        },
        {
          user_id:4,          
          group_id:3,
          role:"moderator",
        },
      ],
      skipDuplicates: true,
    });

    console.log("GrupsUsers seeded!");
  } catch (error) {
    console.log(`Error executant els seeders dels grupsUsers: ${error}`);
  }
};

module.exports = {
seedGroupsUsers,
};
