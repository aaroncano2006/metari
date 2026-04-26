const prisma = require("../../config/prisma");
const { normalizeDate } = require("../../helpers/Utils");

const validateAssignation = async (data, isUpdating = false) => {
  if (data.group_id) {
    const existingGroup = await prisma.group.findFirst({
      where: { id: data.group_id },
    });

    if (!existingGroup) {
      return "La id del grup no correspon a cap grup registrat al sistema!";
    }
  }

  if (data.meta_id) {
    const existingMeta = await prisma.meta.findFirst({
      where: { id: data.meta_id },
    });

    if (!existingMeta) {
      return "La id de la meta no correspon a cap meta registrada en el sistema!";
    }
  }

  if (data.user_id) {
    const existingUser = await prisma.user.findFirst({
      where: { id: data.user_id },
    });

    if (!existingUser) {
      return "La id de l'usuari no correspon a cap usuari registrat en el sistema!";
    }
  }

  let startDate = null;
  let dueDate = null;
  if (data.start_date) {
    startDate = new Date(data.start_date);
    if (isNaN(startDate.getTime())) {
      return "La data d'inici no és vàlida!";
    }
  }

  if (data.due_date) {
    dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      return "La data límit no és vàlida!";
    }
  }

  if (startDate && normalizeDate(startDate) < normalizeDate(new Date()) && !isUpdating) {
    return "La data d'inici no pot ser en el passat!";
  }

  if (startDate && dueDate && normalizeDate(dueDate) < normalizeDate(startDate)) {
    return "La data límit no pot ser anterior a la data d'inici!";
  }

  if (data.priority) {
    const validPriorities = ["high", "low"];

    if (!validPriorities.includes(data.priority)) {
      return "La prioritat especificada no és vàlida!";
    }
  }

  if (!data.difficulty && !isUpdating) {
    return "La dificultat de l'assignació és obligatòria!";
  }

  if (data.difficulty) {
    const validDifficulties = ["easy", "normal", "hard", "extreme"];
    if (!validDifficulties.includes(data.difficulty)) {
      return "La dificultat introduïda no és vàlida!";
    }
  }

  if (data.score !== undefined && data.score !== null) {
    if (isNaN(data.score)) {
      return "El score ha de ser un número!";
    }

    if (data.score < 0) {
      return "El score no pot ser negatiu!";
    }

    if (data.score > 1000000) {
      return "El score és massa gran!";
    }
  }

  return null;
};

module.exports = {
  validateAssignation,
};
