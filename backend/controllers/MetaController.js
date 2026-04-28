const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateMeta } = require("../middlewares/validators/validateMeta");

//Get all
const getMetas = async (req, res, next) => {
  try {
    const metas = await prisma.meta.findMany();
    res.status(200).json(utils.handleBigInt(metas));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const getMetaById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const meta = await prisma.meta.findUnique({
      where: { id },
    });

    if (!meta) {
      const error = new Error("No s'ha trobat la meta!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(meta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const createMeta = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const validate = await validateMeta(reqBody);
    if (validate) {
        const error = new Error(validate);
        error.statusCode = 400;
        throw error;
    }

    const meta = await prisma.meta.create({
      data: {
        title: reqBody.title,
        description: reqBody.description ?? undefined,
        author: {
          connect: { id: parseInt(reqBody.author_id) },
        },
        group: {
          connect: { id: parseInt(reqBody.group_id) },
        },
        type: reqBody.type ?? "task",
      },
    });
    res.status(201).json(utils.handleBigInt(meta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const updateMeta = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const reqBody = req.body;

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const foundMeta = await prisma.meta.findUnique({
        where: {id}
    });

    if (!foundMeta) {
        const error = new Error("No d'ha trobat la meta per actualitzar!");
        error.statusCode = 404;
        throw error;
    }

    const validate = await validateMeta(reqBody);
    if (validate) {
        const error = new Error(validate);
        error.statusCode = 400;
        throw error;
    }

    const meta = await prisma.meta.update({
      where: { id },
      data: {
        title: reqBody.title,
        description: reqBody.description ?? foundMeta.description,
        author: {
            connect: {id: reqBody.author_id !== undefined ? parseInt(reqBody.author_id) : parseInt(foundMeta.author_id)}
        },
        group: {
            connect: {id: reqBody.group_id !== undefined ? parseInt(reqBody.group_id) : parseInt(foundMeta.group_id)}
        },
        type: reqBody.type ?? foundMeta.description,
      },
    });
    res.status(200).json(utils.handleBigInt(meta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const deleteMeta = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    await prisma.meta.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

module.exports = {
  getMetas,
  getMetaById,
  createMeta,
  updateMeta,
  deleteMeta,
};
