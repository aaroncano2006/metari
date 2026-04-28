const prisma = require("../../config/prisma");

const validateComment = async (data, isUpdating = false) => {
  let existingAssignation = null;
  let existingUser = null;
  if (data.assignation_id && !isUpdating) {
    existingAssignation = await prisma.assignation.findUnique({
      where: { id: data.assignation_id },
    });

    if (!existingAssignation) {
      return "La id de l'assignació no correspon a cap assignació registrada en el sistema!";
    }
  }

  if (data.user_id && !isUpdating) {
    existingUser = await prisma.user.findUnique({
      where: { id: data.user_id },
    });

    if (!existingUser) {
      return "La id de l'usuari no correspon a cap usuari registrat en el sistema!";
    }
  }

  if (!isUpdating) {
    const assignationMetaId = existingAssignation.meta_id;
    const assignationGroupId = existingAssignation.group_id;

    const assignationMeta = await prisma.meta.findUnique({
      where: { id: assignationMetaId },
    });

    if (!assignationMeta) {
      return "No s'ha trobat la meta assignada a l'assignació!";
    }

    const metaAuthorId = assignationMeta.author_id;

    const isUserInGroup = await prisma.groupUser.findUnique({
      where: {
        group_id_user_id: {
          group_id: assignationGroupId,
          user_id: existingUser.id,
        },
      },
    });

    const existingGroup = await prisma.group.findUnique({
      where: {
        id: existingAssignation.group_id,
      },
    });

    const isGroupOwner = existingGroup?.owner_id === existingUser.id;

    const isGroupModerator = isUserInGroup?.role === "moderator";

    if (
      existingAssignation.user_id !== existingUser.id &&
      existingUser.id !== metaAuthorId &&
      !isUserInGroup &&
      !isGroupOwner &&
      !isGroupModerator &&
      existingUser.role !== "admin"
    ) {
      return "L'usuari no està vinculat a aquesta assignació!";
    }
  }

  if (!data.body && !isUpdating) {
    return "El cos del comentari és obligatori!";
  }

  if (data.body !== undefined) {
    if (typeof data.body !== "string") {
      return "El cos del comentari ha de ser un text!";
    }

    if (data.body.trim() === "") {
      return "El cos del comentari no pot estar buit!";
    }
  }

  return null;
};

module.exports = {
  validateComment,
};
