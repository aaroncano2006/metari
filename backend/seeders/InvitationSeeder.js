const prisma = require("../config/prisma");

const seedInvitations = async () => {
  try {
    const invitations = await prisma.invitation.findMany();
    const overrideDB = false;

    if (invitations.length > 0 && !overrideDB) {
        console.log("Existing invitations found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.invitation.createMany({
      data: [
        {
            sender_id: 1,
            receiver_id: 2,
            status: accepted,
        },
        {
            sender_id: 2,
            receiver_id: 3,
            status: accepted,
        },
        {
            sender_id: 2,
            receiver_id: 3,
            status: accepted,
        }
      ],
      skipDuplicates: true,
    });

    console.log("Invitations seeded!");
  } catch (error) {
    console.log(`Error executant els seeders: ${error}`);
  }
};

module.exports = {
  seedInvitations: seedInvitations,
};
