const prisma = require("../../config/prisma");

const validateInvitation = async (data) => {
  if (isNaN(data.sender_id) || isNaN(data.receiver_id)) return "IDs no vàlids";
  if (data.sender_id === data.receiver_id)
    return "No et pots convidar a tu mateix";

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
