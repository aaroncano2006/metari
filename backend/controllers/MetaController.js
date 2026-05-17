const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateMeta } = require("../middlewares/validators/validateMeta");

//Get all
const getMetas = async (req, res, next) => {
  try {
    const metas = await prisma.meta.findMany({
      include:{
        category: true,
        author: true

      }
    });
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
      include: {
         category: true}
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

    const data = {
      title: reqBody.title,
      description: reqBody.description ?? undefined,
      author_id: parseInt(reqBody.author_id),
      group_id: parseInt(reqBody.group_id),
      category_id: reqBody.category_id ? parseInt(reqBody.category_id) : undefined,
      type: reqBody.type ?? "task",
      is_public: reqBody.is_public ?? true,
    };

    const validate = await validateMeta(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const meta = await prisma.meta.create({
      data,
      include: { category: true, author: true },
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
      where: { id },
    });

    if (!foundMeta) {
      const error = new Error("No d'ha trobat la meta per actualitzar!");
      error.statusCode = 404;
      throw error;
    }

    const data = {
      title: reqBody.title ?? foundMeta.title,
      description: reqBody.description ?? foundMeta.description,
      author_id: reqBody.author_id ? parseInt(reqBody.author_id) : foundMeta.author_id,
      group_id: reqBody.group_id ? parseInt(reqBody.group_id) : foundMeta.group_id,
      category_id: reqBody.category_id ? parseInt(reqBody.category_id) : foundMeta.category_id,
      type: reqBody.type ?? foundMeta.type,
      is_public: reqBody.is_public ?? foundMeta.is_public,
    };

    const validate = await validateMeta(data, true);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const meta = await prisma.meta.update({
      where: { id },
      data,
      include: { category: true, author: true },
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
