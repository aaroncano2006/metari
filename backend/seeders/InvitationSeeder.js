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
            status: "accepted",
        },
        {
            sender_id: 2,
            receiver_id: 3,
            status: "accepted",
        },
        {
            sender_id: 2,
            receiver_id: 3,
            status: "accepted",
        },
        {
            sender_id: 4,
            receiver_id: 1,
            status: "accepted",
        },
        {
            sender_id: 4,
            receiver_id: 3,
        },
        {
            sender_id: 4,
            receiver_id: 7,
        },
        {
            sender_id: 4,
            receiver_id: 8,
            status: "accepted",
        },
        {
            sender_id: 4,
            receiver_id: 9,
            status: "accepted",
        },
        {
            sender_id: 12,
            receiver_id: 1,
            status: "pending",
        },
        {
            sender_id: 12,
            receiver_id: 6,
            status: "pending",
            group_id: 7,
        },
        {
            sender_id: 12,
            receiver_id: 7,
            status: "pending",
            group_id: 7,
        },
        {
            sender_id: 12,
            receiver_id: 4,
            status: "accepted",
        },
        {
            sender_id: 12,
            receiver_id: 3,
            status: "accepted",
        },
        {
            sender_id: 12,
            receiver_id: 2,
            status: "accepted",
        },
        {
            sender_id: 12,
            receiver_id: 6,
            status: "pending",
        },
        {
            sender_id: 1,
            receiver_id: 12,
            status: "pending",
            group_id: 1,
        },
        {
            sender_id: 12,
            receiver_id: 5,
            status: "accepted",
        },
        {
            sender_id: 12,
            receiver_id: 8,
            status: "pending",
            group_id: 6,
        },
        {
            sender_id: 1,
            receiver_id: 12,
            status: "pending",
            group_id: 1,
        },
        {
            sender_id: 7,
            receiver_id: 12,
            group_id: 5,
            status: "pending",
        },
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
