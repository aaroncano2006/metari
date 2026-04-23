const prisma = require("../../config/prisma");

const validateInvitation = async (data) => {
  if (data.sender_id === data.receiver_id)
    return "No et pots convidar a tu mateix";

  const existingInv = await prisma.invitation.findFirst({
    where: {
      group_id: data.group_id || null,
      OR: [
        { sender_id: data.sender_id, receiver_id: data.receiver_id },
        { sender_id: data.receiver_id, receiver_id: data.sender_id },
      ],
      
      status: { in: ["pending", "accepted"] },
    },
  });

  if (existingInv) {
    return existingInv.status === "pending"
      ? "Ja hi ha una sol·licitud pendent."
      : "Ja sou amics o formeu part d'aquest grup.";
  }

  const receiverAlreadyInGroup = await prisma.groupUser.findFirst({
    where: {
      group: {
        id: data.group_id
      },
      user: {
        id: data.receiver_id
      }
    }
  });

  if (receiverAlreadyInGroup) {
    return "L'usuari receptor ja forma part d'aquest grup!";
  }

  const [sender, receiver, group] = await Promise.all([
    prisma.user.findUnique({ where: { id: data.sender_id } }),
    prisma.user.findUnique({ where: { id: data.receiver_id } }),
    data.group_id
      ? prisma.group.findUnique({ where: { id: data.group_id } })
      : Promise.resolve(null),
  ]);

  if (!sender || !receiver) return "L'emissor o el receptor no existeixen";
  if (data.group_id && !group) return "El grup no existeix";

  return { sender, receiver, group };
};

module.exports = { validateInvitation };
