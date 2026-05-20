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
        meta: {
          include: {
            indexedMetas: {
              select: { is_community_approved: true }
            }
          }
        },
        user: true,
        comments: true,
        proofs: true,
        assignationCompletions: {
          include: { user: true }
        }
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
        meta: { include: { indexedMetas: { select: { is_community_approved: true } } } },
        user: true,
        comments: true,
        proofs: true,
      },
    });

    if (!assignation) {
      const error = new Error("No s'ha trobat l'assignació");
      error.statusCode = 404;
      throw error;
    }

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
      group_id: groupId ?? null,
      meta_id: metaId,
      user_id: userId ?? null,
      start_date: reqBody.start_date
        ? new Date(reqBody.start_date)
        : new Date(),
      due_date: reqBody.due_date ? new Date(reqBody.due_date) : null,
      priority: reqBody.priority ?? null,
      difficulty: reqBody.difficulty ?? "normal",
      score:
        reqBody.score !== undefined
          ? reqBody.score !== null
            ? BigInt(reqBody.score)
            : null
          : null,
      completed: reqBody.completed ?? false,
      needs_proofs: reqBody.needs_proofs ?? null,
      assigner_id: reqBody.assigner_id ? parseInt(reqBody.assigner_id) : null,
    };

    const validate = await validateAssignation(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const assignation = await prisma.assignation.create({
      data,
      include: {
        group: true,
        meta: { include: { indexedMetas: { select: { is_community_approved: true } } } },
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
  try {
    const reqBody = req.body;
    const id = parseInt(req.params.id);
    const groupId = reqBody.group_id ? parseInt(reqBody.group_id) : undefined;
    const userId = reqBody.user_id ? parseInt(reqBody.user_id) : undefined;
    const metaId = reqBody.meta_id ? parseInt(reqBody.meta_id) : undefined;

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const existingAssignation = await prisma.assignation.findUnique({
      where: { id },
    });

    if (!existingAssignation) {
      const error = new Error("No s'ha trobat l'assignació a actualitzar!");
      error.statusCode = 404;
      throw error;
    }

    const data = {
      group_id: groupId !== undefined ? groupId : existingAssignation.group_id,
      meta_id: metaId !== undefined ? metaId : existingAssignation.meta_id,
      user_id: userId !== undefined ? userId : existingAssignation.user_id,
      start_date:
        reqBody.start_date !== undefined
          ? new Date(reqBody.start_date)
          : existingAssignation.start_date,
      due_date:
        reqBody.due_date !== undefined
          ? new Date(reqBody.due_date)
          : existingAssignation.due_date,
      priority: reqBody.priority ?? existingAssignation.priority,
      difficulty: reqBody.difficulty ?? existingAssignation.difficulty,
      score:
        reqBody.score !== undefined
          ? reqBody.score !== null
            ? BigInt(reqBody.score)
            : null
          : existingAssignation.score,
      completed: reqBody.completed ?? existingAssignation.completed,
    };

    const validate = await validateAssignation(data, true);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const updatedAssignation = await prisma.assignation.update({
      where: { id },
      data,
      include: {
        group: true,
        meta: { include: { indexedMetas: { select: { is_community_approved: true } } } },
        user: true,
        comments: true,
        proofs: true,
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
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    await prisma.assignationCompletions.deleteMany({
      where: { assignation_id: id },
    });
    await prisma.comment.deleteMany({
      where: { assignation_id: id },
    });
    await prisma.proof.deleteMany({
      where: { assignation_id: id },
    });

    await prisma.assignation.delete({
      where: { id },
    });

    res.status(204).end();
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
