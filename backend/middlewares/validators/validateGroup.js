const prisma = require("../../config/prisma");

const validateGroup = async (data) => {
  if (!data.name) {
    return "El nom del grup és obligatori!";
  }

  if (typeof data.name !== "string") {
    return "El nom enviat no és vàlid! Ha de ser un text";
  }

  if (data.name.trim() === "") {
    return "El nom enviat està buit.";
  }

  if (data.name.length < 5) {
    return "El nom del grup ha de contenir almenys 5 caràcters.";
  }

  if (data.description && typeof data.description !== "string") {
    return "La descripció enviada no és vàlida! Ha de ser un text";
  }

  if (!data.owner_id) {
    return "La id del propietari del grup és obligatòria";
  }

  if (isNaN(data.owner_id)) {
    return "La id del propietari del grup és invàlida!";
  }

  const existingOwner = await prisma.user.findUnique({
    where: {id: data.owner_id}
  });

  if (!existingOwner) {
    return "La id del propietari enviada no correspon a cap usuari registrat!";
  }

  return null;
};

module.exports = {
  validateGroup,
};
