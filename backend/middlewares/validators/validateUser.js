const prisma = require("../../config/prisma");

const validateUser = async (data, id = null) => {
  if (!data.name) {
    return "El nom de l'usuari és obligatori!";
  }

  if (typeof data.name !== "string") {
    return "El nom enviat no és vàlid! Ha de ser un text";
  }

  if (data.name.trim() === "") {
    return "El nom enviat està buit.";
  }

  if (!data.username) {
    return "El nom d'usuari és obligatori!";
  }

  if (typeof data.username !== "string") {
    return "El nom d'usuari enviat no és vàlid! Ha deser un text";
  }

  if (data.username.trim() === "") {
    return "El nom d'usuari enviat està buit!";
  }

  if (data.username.length < 5) {
    return "El nom d'usuari ha de contenir almenys 5 caràcters!";
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUsername && existingUsername.id !== id) {
    return "Ja existeix un usuari amb aquest nom!";
  }

  if (!id && !data.password) {
    return "La contrasenya és obligatòria";
  }

  if (data.password) {
    if (typeof data.password !== "string") {
      return "La contrasenya introduïda no és vàlida! Ha de ser un text!";
    }

    if (data.password.trim() === "") {
      return "La contrasenya està buida!";
    }

    if (data.password.length < 8) {
      return "La contrasenya ha de contenir almenys 8 caràcters!";
    }
  }

  if (
    id !== null &&
    data.role &&
    data.role !== "user" &&
    data.role !== "admin"
  ) {
    return "El rol de l'usuari introduït no és vàlid";
  }

  return null;
};

module.exports = {
  validateUser,
};
