const prisma = require("../../config/prisma");
const validateProof = async (data, isUpdating = false) => {
  if (data.assignation_id && !isUpdating) {
    const existingAssignation = await prisma.assignation.findUnique({
      where: { id: data.assignation_id },
    });
    if (!existingAssignation) {
      return "La id de l'assignació no correspon a cap assignació registrada!";
    }
  }
  if (data.user_id) {
    if (isNaN(data.user_id)) {
      return "La id de l'usuari no és vàlida!";
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(data.user_id) },
    });
    if (!existingUser) {
      return "La id de l'usuari no correspon a cap usuari registrat!";
    }
  }
  if (!data.proof_type && !isUpdating) {
    return "El tipus de prova és obligatori!";
  }
  if (data.proof_type && data.proof_type !== "text" && data.proof_type !== "image") {
    return "El tipus de prova no es vàlid! Ha de ser 'text' o 'image'.";
  }
  if (data.proof_type === "text" && !data.proof && !isUpdating) {
    return "La prova de tipus text ha de tenir contingut!";
  }
  if (data.is_valid !== undefined && typeof data.is_valid !== "boolean" && data.is_valid !== "true" && data.is_valid !== "false") {
    return "El camp is_valid ha de ser un booleà!";
  }
  return null;
};
module.exports = {
  validateProof,
};