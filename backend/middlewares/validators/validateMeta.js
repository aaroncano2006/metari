const prisma = require("../../config/prisma");

const validateMeta = async (data, isUpdating = false) => {
  let existingAuthor = null;
  let existingGroup = null;

  if (!data.title && !isUpdating) {
    return "El títol de la meta és obligatori";
  }

  if (data.title) {
    if (typeof data.title !== "string") {
      return "El títol enviat no és vàlid! Ha de ser un text.";
    }

    if (data.title.trim() === "") {
      return "El títol enviat està buit.";
    }

    if (data.title.length < 5) {
      return "El títol de la meta ha de tenir com a mínim 5 caràcters!";
    }
  }

  if (data.description && typeof data.description !== "string") {
    return "La descripció enviada no és vàlida! Ha de ser un text.";
  }


  if (!data.author_id && !isUpdating) {
    return "La id de l'autor de la meta és obligatoria!";
  }

  if (data.author_id) {
    if (isNaN(data.author_id)) {
      return "La id de l'autor de la meta no és vàlida";
    }

    existingAuthor = await prisma.user.findUnique({
      where: { id: parseInt(data.author_id) },
    });

    if (!existingAuthor) {
      return "La id de l'autor enviada no correspon a cap usuari registrat!";
    }
  }
  //no sempre cal grup (admin editant una meta)
  // if (!data.group_id && isUpdating) {
  //   return "La id del grup de la meta és obligatoria!";
  // }

  if (data.group_id) {
    if (isNaN(data.group_id)) {
      return "La id del grup de la meta no és vàlida";
    }

    existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(data.group_id) },
    });

    if (!existingGroup) {
      return "La id del grup enviada no correspon a cap grup registrat en el sistema.";
    }
  }

  // if (data.author_id && data.group_id) {
  //   let isAuthorInGroup = await prisma.groupUser.findUnique({
  //       where: {
  //           group_id_user_id: {
  //               group_id: existingGroup.id,
  //               user_id: existingAuthor.id
  //           }
  //       }
  //   });

  //   if (!isAuthorInGroup) {
  //       isAuthorInGroup = existingGroup.owner_id === existingAuthor.id

  //       if (!isAuthorInGroup) {
  //           return "L'autor de la meta no pertany al grup!";
  //       }
  //   }
  // }

  if (!data.type && !isUpdating) {
    return "El tipus de la meta és obligatori!";
  }

  if (data.type && data.type !== "task" && data.type !== "challenge") {
    return "El tipus de meta no és vàlid!";
  }

  return null;
};

module.exports = {
  validateMeta,
};
