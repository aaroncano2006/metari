const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const {
  validateAssignation,
} = require("../middlewares/validators/validateAssignation");

// GET ALL
const getAssignations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const assignations = await prisma.assignation.findMany({
      where: {
        OR: [
          { user_id: userId },
          { assigner_id: userId },
          { group: { owner_id: userId } },
          { group: { groupUsers: { some: { user_id: userId } } } },
        ],
      },
      include: {
        group: true,
        meta: {
          include: {
            indexedMetas: {
              select: { is_community_approved: true, is_approved: true }
            }
          }
        },
        user: true,
        assigner: true,
        comments: true,
        proofs: { include: { user: true } },
        assignationCompletions: {
          include: { user: true }
        }
      },
    });
    res.status(200).json(utils.handleBigInt(assignations));
  } catch (error) {
    console.error("Error en Prisma:", error);
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

    const userId = req.user.id;

    const assignation = await prisma.assignation.findFirst({
      where: {
        id,
        OR: [
          { user_id: userId },
          { assigner_id: userId },
          { group: { owner_id: userId } },
          { group: { groupUsers: { some: { user_id: userId } } } },
        ],
      },
      include: {
        group: true,
        meta: { include: { indexedMetas: { select: { is_community_approved: true } } } },
        user: true,
        assigner: true,
        comments: true,
        proofs: { include: { user: true } },
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
    const targetUserId = reqBody.user_id ? parseInt(reqBody.user_id) : null;
    const metaId = parseInt(reqBody.meta_id);
    const currentUserId = req.user.id;

    if (
      (groupId && isNaN(groupId)) ||
      (targetUserId && isNaN(targetUserId)) ||
      isNaN(metaId)
    ) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    if (groupId) {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          groupUsers: {
            where: { user_id: currentUserId },
          },
        },
      });

      if (!group) {
        const error = new Error("El grup no existeix");
        error.statusCode = 404;
        throw error;
      }

      const isOwner = group.owner_id === currentUserId;
      const isModerator = group.groupUsers.some(
        (gu) => gu.role === "moderator"
      );

      if (!isOwner && !isModerator && req.user.role !== "admin") {
        const error = new Error("No tens permisos per assignar metes en aquest grup");
        error.statusCode = 403;
        throw error;
      }
    }

    const data = {
      group_id: groupId ?? null,
      meta_id: metaId,
      user_id: targetUserId ?? null,
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
      assigner_id: currentUserId,
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
        assigner: true,
        comments: true,
        proofs: { include: { user: true } },
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
    const targetUserId = reqBody.user_id ? parseInt(reqBody.user_id) : undefined;
    const metaId = reqBody.meta_id ? parseInt(reqBody.meta_id) : undefined;
    const currentUserId = req.user.id;

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const existingAssignation = await prisma.assignation.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            groupUsers: {
              where: { user_id: currentUserId },
            },
          },
        },
      },
    });

    if (!existingAssignation) {
      const error = new Error("No s'ha trobat l'assignació a actualitzar!");
      error.statusCode = 404;
      throw error;
    }

    const group = existingAssignation.group;
    const canManageAll = group
      ? group.owner_id === currentUserId ||
        group.groupUsers.some((gu) => gu.role === "moderator") ||
        req.user.role === "admin"
      : req.user.role === "admin";

    const isAssignedUser = existingAssignation.user_id === currentUserId;
    const isAssigner = existingAssignation.assigner_id === currentUserId;

    if (!canManageAll && !isAssignedUser && !isAssigner) {
      const error = new Error("No tens permisos per modificar aquesta assignació");
      error.statusCode = 403;
      throw error;
    }

    const changingOtherFields = Object.keys(req.body).some(
      (k) => k !== "completed"
    );

    if (!canManageAll) {
      if (changingOtherFields) {
        const error = new Error("Només pots modificar l'estat de completat");
        error.statusCode = 403;
        throw error;
      }

      if (isAssignedUser && reqBody.completed === true && group) {
        if (existingAssignation.needs_proofs) {
          const error = new Error(
            "Aquesta assignació requereix una prova per ser completada"
          );
          error.statusCode = 403;
          throw error;
        }
      }
    }

    const data = {
      group_id: groupId !== undefined ? groupId : existingAssignation.group_id,
      meta_id: metaId !== undefined ? metaId : existingAssignation.meta_id,
      user_id: targetUserId !== undefined ? targetUserId : existingAssignation.user_id,
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
        assigner: true,
        comments: true,
        proofs: { include: { user: true } },
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
    const id = parseInt(req.params.id);
    const currentUserId = req.user.id;

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const existingAssignation = await prisma.assignation.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            groupUsers: {
              where: { user_id: currentUserId },
            },
          },
        },
      },
    });

    if (!existingAssignation) {
      const error = new Error("No s'ha trobat l'assignació a eliminar!");
      error.statusCode = 404;
      throw error;
    }

    const group = existingAssignation.group;
    if (group) {
      const isOwner = group.owner_id === currentUserId;
      const isModerator = group.groupUsers.some(
        (gu) => gu.role === "moderator"
      );
      if (!isOwner && !isModerator && req.user.role !== "admin") {
        const error = new Error("No tens permisos per eliminar aquesta assignació");
        error.statusCode = 403;
        throw error;
      }
    } else if (req.user.role !== "admin") {
      const error = new Error("Aquesta assignació no pertany a cap grup");
      error.statusCode = 403;
      throw error;
    }

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
