const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateGroup } = require("../middlewares/validators/validateGroup");

const getGroups = async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany();
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

    const group = await prisma.group.findUnique({
      where: { id },
      // include: {
      //     owner: true,
      //     metas: true,
      //     assignations: true,
      //     invitations: true,
      //     groupUsers: true,
      //     indexedMetas: true,
      // },
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

const createGroup = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const validate = await validateGroup(reqBody);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const group = await prisma.group.create({
      data: {
        name: reqBody.name,
        description: reqBody.description ?? undefined,
        is_public: reqBody.is_public ?? true,
        owner: {
          connect: { id: parseInt(reqBody.owner_id) },
        },
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

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const foundGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!foundGroup) {
      const error = new Error("No s'ha trobat el grup per actualitzar!");
      error.statusCode = 404;
      throw error;
    }

    const validate = await validateGroup(reqBody);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const group = await prisma.group.update({
      where: { id },
      data: {
        name: reqBody.name ?? foundGroup.name,
        description: reqBody.description ?? foundGroup.description,
        is_public: reqBody.is_public ?? foundGroup.is_public,
        owner: {
          connect: {
            id:
              reqBody.owner_id !== undefined
                ? parseInt(reqBody.owner_id)
                : foundGroup.owner_id,
          },
        },
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

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
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
  createGroup,
  updateGroup,
  deleteGroup,
};
