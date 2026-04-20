const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateMeta } = require("../middlewares/validators/validateMeta");

//Get all
const getMetas = async (req, res, next) => {
  try {
    const metas = await prisma.meta.findMany();
    res.status(200).json(metas);
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

    const meta = await prisma.meta.create({
      data: {
        title: reqBody.title,
        description: reqBody.description,
        author: {
          connect: { id: parseInt(reqBody.author_id) },
        },
        group: {
          connect: { id: parseInt(reqBody.group_id) },
        },
        type: reqBody.type,
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

    const meta = await prisma.meta.update({
      where: { id },
      data: {
        title: reqBody.title,
        description: reqBody.description,
        author: {
            connect: {id: parseInt(reqBody.author_id)}
        },
        group: {
            connect: {id: parseInt(reqBody.group_id)}
        },
        type: reqBody.type,
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
    res.status(204).json({ message: "Meta eliminada correctament" });
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
