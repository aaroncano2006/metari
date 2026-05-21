const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const {
  validateComment,
} = require("../middlewares/validators/validateComment");

const getComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        assignation: true,
        user: true,
      },
    });

    res.status(200).json(utils.handleBigInt(comments));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar comentaris" });
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        assignation: true,
        user: true,
      },
    });

    if (!comment) {
      const error = new Error("No s'ha trobat el comentari!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(comment));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar el comentari" });
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const assignationId = parseInt(reqBody.assignation_id);
    const userId = req.user.id;

    if (isNaN(assignationId) || isNaN(userId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const data = {
      ...reqBody,
      assignation_id: assignationId,
      user_id: userId,
    };

    const validate = await validateComment(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const comment = await prisma.comment.create({
      data,
      include: {
        assignation: true,
        user: true
      }
    });

    res.status(201).json(utils.handleBigInt(comment));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al crear el comentari" });
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const existingComment = await prisma.comment.findUnique({
      where: {id}
    });

    if (!existingComment) {
      const error = new Error("El comentari no existeix!");
      error.statusCode = 404;
      throw error;
    }

    if (existingComment.user_id !== req.user.id) {
      const error = new Error("No tens permisos per editar aquest comentari!");
      error.statusCode = 403;
      throw error;
    }

    const data = {
      body: reqBody.body ?? existingComment.body
    };

    const validate = await validateComment(data, true);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const updatedComment = await prisma.comment.update({
      where: {id},
      data,
      include: {
        assignation: true,
        user: true
      }
    });

    res.status(200).json(utils.handleBigInt(updatedComment));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al actualitzar el comentari" });
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.user.id;

    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        assignation: {
          include: {
            group: {
              include: {
                groupUsers: {
                  where: { user_id: currentUserId },
                },
              },
            },
          },
        },
      },
    });

    if (!existingComment) {
      const error = new Error("No s'ha trobat el comentari!");
      error.statusCode = 404;
      throw error;
    }

    const isAuthor = existingComment.user_id === currentUserId;
    const isAdmin = req.user.role === "admin";
    const group = existingComment.assignation?.group;

    let isGroupOwner = false;
    let isGroupModerator = false;

    if (group) {
      isGroupOwner = group.owner_id === currentUserId;
      isGroupModerator = group.groupUsers.some(
        (gu) => gu.role === "moderator"
      );
    }

    if (!isAuthor && !isAdmin && !isGroupOwner && !isGroupModerator) {
      const error = new Error("No tens permisos per eliminar aquest comentari!");
      error.statusCode = 403;
      throw error;
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al eliminar el comentari" });
    next(error);
  }
};

module.exports = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
