const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const {
  validateAssignation,
} = require("../middlewares/validators/validateAssignation");

// GET ALL
const getAssignations = async (req, res, next) => {
  try {
    const assignations = await prisma.assignation.findMany({
      include: {
        group: true,
        meta: true,
        user: true,
        comments: true,
        proofs: true,
      },
    });
    res.status(200).json(utils.handleBigInt(assignations));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar assignacions" });
    next(error);
  }
};

const getAssignationById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const assignation = await prisma.assignation.findUnique({
      where: { id },
      include: {
        group: true,
        meta: true,
        user: true,
        comments: true,
        proofs: true,
      },
    });

    res.status(200).json(utils.handleBigInt(assignation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const createAssignation = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const groupId = reqBody.group_id ? parseInt(reqBody.group_id) : null;
    const userId = reqBody.user_id ? parseInt(reqBody.user_id) : null;
    const metaId = parseInt(reqBody.meta_id);

    if (
      (groupId && isNaN(groupId)) ||
      (userId && isNaN(userId)) ||
      isNaN(metaId)
    ) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const data = {
      ...reqBody,
      group_id: groupId,
      meta_id: metaId,
      user_id: userId,
    };

    const validate = await validateAssignation(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const assignation = await prisma.assignation.create({
      data: {
        group_id: groupId ?? null,
        meta_id: metaId,
        user_id: userId ?? null,
        start_date: reqBody.start_date
          ? new Date(reqBody.start_date)
          : new Date(),
        due_date: reqBody.due_date ? new Date(reqBody.due_date) : new Date(),
        priority: reqBody.priority ?? null,
        difficulty: reqBody.difficulty ?? "normal",
        score: reqBody.score ? BigInt(reqBody.score) : null,
        completed: reqBody.completed ?? false,
      },
      include: {
        group: true,
        meta: true,
        user: true,
        comments: true,
        proofs: true,
      },
    });

    res.status(201).json(utils.handleBigInt(assignation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al crear assignació" });
    next(error);
  }
};

const updateAssignation = async (req, res, next) => {
  const reqBody = req.body;
  const { id } = req.params;

  if (
    (reqBody.group_id && reqBody.user_id) ||
    (!reqBody.group_id && !reqBody.user_id)
  ) {
    return res.status(400).json({
      error:
        "You must provide either group_id or user_id, but not both or neither.",
    });
  }

  try {
    const updatedAssignation = await prisma.assignation.update({
      where: { id: Number(id) },
      data: {
        group_id: reqBody.group_id ? parseInt(reqBody.group_id) : null,
        meta_id: parseInt(reqBody.meta_id),
        user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
        start_date: reqBody.start_date,
        due_date: reqBody.due_date,
        priority: reqBody.priority,
        difficulty: reqBody.difficulty ?? "normal",
        score: reqBody.score ? BigInt(reqBody.score) : null,
        completed: reqBody.completed ?? false,
      },
    });

    res.status(200).json(utils.handleBigInt(updatedAssignation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al actualitzar assignació" });
    next(error);
  }
};

const deleteAssignation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.assignation.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Assignació eliminada correctament" });
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

module.exports = {
  getAssignations,
  getAssignationById,
  createAssignation,
  updateAssignation,
  deleteAssignation,
};
