const prisma = require("../../config/prisma");

const validateInvitation = async (data) => {
  if (data.sender_id === data.receiver_id)
    return "No et pots convidar a tu mateix";

  const countInv = await prisma.invitation.count({
    where: data.group_id
      ? {
          OR: [
            {
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              group_id: data.group_id,
            },
            {
              sender_id: data.receiver_id,
              receiver_id: data.sender_id,
              group_id: data.group_id,
            },
          ],
        }
      : {
          OR: [
            {
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              group_id: null,
            },
            {
              sender_id: data.receiver_id,
              receiver_id: data.sender_id,
              group_id: null,
            },
          ],
        },
  });

  if (countInv > 0) {
    return "Ja existeix una sol·licitud amb aquestes característiques.";
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
