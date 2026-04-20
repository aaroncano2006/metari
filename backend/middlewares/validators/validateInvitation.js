const prisma = require("../../config/prisma");

const validateInvitation = async (data) => {
  if (isNaN(data.sender_id)) {
    return "La id del emissor no és vàlida!";
  }

  const sender = await prisma.user.findUnique({
    where: { id: data.sender_id },
  });

  if (isNaN(data.receiver_id)) {
    return "La id del receptor no és vàlida!";
  }

  const receiver = await prisma.user.findUnique({
    where: { id: data.receiver_id },
  });

  if (data.group_id && isNaN(data.groupId)) {
    return "La id del grup no és vàlida!";
  }

  const group = data.group_id
    ? await prisma.group.findUnique({
        where: { id: data.group_id },
      })
    : null;

  if (sender === receiver) {
    return "No et pots enviar sol·licitud d'amistat a tu mateix!";
  }

  if (!sender || !receiver) {
    return "No s'ha trobat emissor o receptor!";
  }

  return null;
};

module.exports = {
  validateInvitation,
};
