const prisma = require("../../config/prisma");

const validateGroupUser = async (data) => {
  if (data.group_id) {
    const existingGroup = await prisma.group.findUnique({
      where: { id: data.group_id },
    });
    if (!existingGroup) {
      return "La id del grup no correspon a cap grup registrat al sistema!";
    }
  }

  if (data.user_id) {
    const existingUser = await prisma.user.findUnique({
      where: { id: data.user_id },
    });

    if (!existingUser) {
      return "La id de l'usuari no correspon a cap usuari registrat al sistema!";
    }
  }

  const validRoles = ["member", "moderator"];

  if (data.role && !validRoles.includes(data.role)) {
    return "El rol especificat no és vàlid!";
  }

  if (data.user_id && data.group_id) {
    const existingEntrance = await prisma.groupUser.findUnique({
      where: {
        group_id_user_id: {
          group_id: data.group_id,
          user_id: data.user_id,
        },
      },
    });

    if (existingEntrance) {
      return "Ja hi ha una relació amb aquestes característiques!";
    }
  }

  return null;
};

module.exports = {
  validateGroupUser,
};
