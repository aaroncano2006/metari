const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateGroup } = require("../middlewares/validators/validateGroup");

const getGroups = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const groups = await prisma.group.findMany({
      where: isAdmin ? undefined : {
        OR: [
          { is_public: true },
          { owner_id: userId },
          { groupUsers: { some: { user_id: userId } } },
        ],
      },
      include: {
        owner: true,
        groupUsers: {
          include: {
            user: true
          }
        }
      }
    });
    res.status(200).json(utils.handleBigInt(groups));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const getGroupById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const group = await prisma.group.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : {
          OR: [
            { is_public: true },
            { owner_id: userId },
            { groupUsers: { some: { user_id: userId } } },
          ],
        }),
      },
      include: {
        owner: true,
        groupUsers: {
          include: { user: true }
        },
      },
    });

    if (!group) {
      const error = new Error("No s'ha trobat el grup");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(group));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const getGroupsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { owner_id: userId },
          { groupUsers: { some: { user_id: userId } } },
        ],
      },
      include: {
        owner: true,
        groupUsers: {
          include: { user: true },
        },
      },
    });
    res.status(200).json(utils.handleBigInt(groups));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = {
      name: reqBody.name,
      description: reqBody.description ?? undefined,
      is_public: reqBody.is_public ?? true,
      owner_id: req.user.id,
    };

    const validate = await validateGroup(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const group = await prisma.group.create({
      data,
      include: {
        owner: true,
        groupUsers: {
          include: { user: true }
        }
      },
    });
    res.status(201).json(utils.handleBigInt(group));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const reqBody = req.body;
    const userId = req.user.id;

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const foundGroup = await prisma.group.findUnique({
      where: { id },
      include: {
        groupUsers: {
          where: { user_id: userId },
        },
      },
    });

    if (!foundGroup) {
      const error = new Error("No s'ha trobat el grup per actualitzar!");
      error.statusCode = 404;
      throw error;
    }

    const isOwner = foundGroup.owner_id === userId;
    const isModerator = foundGroup.groupUsers.some(
      (gu) => gu.role === "moderator"
    );

    if (!isOwner && !isModerator && req.user.role !== "admin") {
      const error = new Error("No tens permisos per actualitzar aquest grup");
      error.statusCode = 403;
      throw error;
    }

    const data = {
      name: reqBody.name ?? foundGroup.name,
      description: reqBody.description ?? foundGroup.description,
      is_public: reqBody.is_public ?? foundGroup.is_public,
    };

    if (isOwner && reqBody.owner_id !== undefined) {
      data.owner_id = parseInt(reqBody.owner_id);
    }

    const validate = await validateGroup(reqBody, true);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const group = await prisma.group.update({
      where: { id },
      data,
      include: {
        owner: true,
        groupUsers: {
          include: { user: true }
        }
      },
    });
    res.status(200).json(utils.handleBigInt(group));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const foundGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!foundGroup) {
      const error = new Error("No s'ha trobat el grup per eliminar!");
      error.statusCode = 404;
      throw error;
    }

    if (foundGroup.owner_id !== userId && req.user.role !== "admin") {
      const error = new Error("No tens permisos per eliminar aquest grup");
      error.statusCode = 403;
      throw error;
    }

    await prisma.group.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

module.exports = {
  getGroups,
  getGroupById,
  getGroupsByUserId,
  createGroup,
  updateGroup,
  deleteGroup,
};
