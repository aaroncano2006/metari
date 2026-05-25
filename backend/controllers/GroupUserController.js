const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const {
  validateGroupUser,
} = require("../middlewares/validators/validateGroupUser");

const getGroupUsers = async (req, res, next) => {
  try {
    const groupUsers = await prisma.groupUser.findMany({
      include: {
        group: true,
        user: true,
      },
    });

    res.status(200).json(utils.handleBigInt(groupUsers));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar relacions grup-usuari" });
    next(error);
  }
};

const getGroupUser = async (req, res, next) => {
  try {
    // const { group_id, user_id } = req.params;
    const groupId = parseInt(req.params.group_id);
    const userId = parseInt(req.params.user_id);
    if (isNaN(groupId) || isNaN(userId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const groupUser = await prisma.groupUser.findUnique({
      where: {
        group_id_user_id: {
          group_id: parseInt(group_id),
          user_id: parseInt(user_id),
        },
      },
      include: {
        group: true,
        user: true,
      },
    });

    if (!groupUser) {
      //   return res.status(404).json({ error: "Relació no trobada" });
      const error = new Error("Relació no trobada!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(groupUser));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar la relació" });
    next(error);
  }
};

const createGroupUser = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const groupId = parseInt(reqBody.group_id);
    const userId = parseInt(reqBody.user_id);
    const role = reqBody.role ?? undefined;

    if (isNaN(groupId) || isNaN(userId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const data = {
      group_id: groupId,
      user_id: userId,
      role,
    };

    const validate = await validateGroupUser(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const groupUser = await prisma.groupUser.create({
      data: {
        group_id: groupId,
        user_id: userId,
        role,
      },
      include: {
        group: true,
        user: true,
      },
    });

    res.status(201).json(utils.handleBigInt(groupUser));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al afegir usuari al grup" });
    next(error);
  }
};

const updateGroupUser = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const groupId = parseInt(req.params.group_id);
    const userId = parseInt(req.params.user_id);
    const role = reqBody.role ?? undefined;

    if (isNaN(groupId) || isNaN(userId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const data = {
      role,
    };

    const validate = await validateGroupUser(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const updatedGroupUser = await prisma.groupUser.update({
      where: {
        group_id_user_id: {
          group_id: groupId,
          user_id: userId,
        },
      },
      data: {
        role,
      },
      include: {
        group: true,
        user: true,
      },
    });

    res.status(200).json(utils.handleBigInt(updatedGroupUser));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al actualitzar la relació" });
    next(error);
  }
};

const deleteGroupUser = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.group_id);
    const userId = parseInt(req.params.user_id);

    if (isNaN(groupId) || isNaN(userId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      const error = new Error("Grup no trobat!");
      error.statusCode = 404;
      throw error;
    }

    if (group.owner_id === userId) {
      const error = new Error(
        "El propietari del grup no pot sortir-ne! Transfereix la propietat primer.",
      );
      error.statusCode = 400;
      throw error;
    }

    const deleted = await prisma.groupUser.delete({
      where: {
        group_id_user_id: {
          group_id: parseInt(req.params.group_id),
          user_id: parseInt(req.params.user_id),
        },
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al eliminar la relació" });
    next(error);
  }
};

module.exports = {
  getGroupUsers,
  getGroupUser,
  createGroupUser,
  updateGroupUser,
  deleteGroupUser,
};
