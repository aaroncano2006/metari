const prisma = require("../../config/prisma");
const validateIndexedMeta = async (data, isUpdating = false) => {
  if (!data.meta_id && !isUpdating) {
    return "La id de la meta és obligatòria!";
  }
  if (data.meta_id) {
    if (isNaN(data.meta_id)) {
      return "La id de la meta no és vàlida!";
    }
    const existingMeta = await prisma.meta.findUnique({
      where: { id: parseInt(data.meta_id) },
    });
    if (!existingMeta) {
      return "La id de la meta no correspon a cap meta registrada!";
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
  if (data.is_approved && typeof data.is_approved !== "boolean" && data.is_approved !== "true" && data.is_approved !== "false") {
    return "El camp is_approved ha de ser un booleà!";
  }
  if (data.is_community_approved && typeof data.is_community_approved !== "boolean" && data.is_community_approved !== "true" && data.is_community_approved !== "false") {
    return "El camp is_community_approved ha de ser un booleà!";
  }
  return null;
};
module.exports = {
  validateIndexedMeta,
};