const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateMeta } = require("../middlewares/validators/validateMeta");

const getMetas = async (req, res, next) => {
  try {
    const where = {};
    if (!req.user) {
      where.is_public = true;
    }

    const metas = await prisma.meta.findMany({
      where,
      include: {
        category: true,
        author: true,
        indexedMetas: {
          select: { is_community_approved: true, is_approved: true }
        },
      },
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
        category: true,
        author: true,
      },
    });

    if (!meta) {
      const error = new Error("No s'ha trobat la meta!");
      error.statusCode = 404;
      throw error;
    }

    if (!meta.is_public && !req.user) {
      const error = new Error("Meta no trobada!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(meta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};


const getMetasByUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      const error = new Error("ID d'usuari invàlid");
      error.statusCode = 400;
      throw error;
    }

    const where = { author_id: userId };
    if (!req.user) {
      where.is_public = true;
    }

    const metas = await prisma.meta.findMany({
      where,
      include: {
        category: true,
        author: true,
        indexedMetas: {
          select: { is_community_approved: true, is_approved: true }
        },
      },
    });
    res.status(200).json(utils.handleBigInt(metas));
  } catch (error) { next(error); }
};

const createMeta = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = {
      title: reqBody.title,
      description: reqBody.description ?? undefined,
      author_id: req.user.id,
      group_id: reqBody.group_id ? parseInt(reqBody.group_id) : undefined,
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
      const error = new Error("No s'ha trobat la meta per actualitzar!");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.id !== foundMeta.author_id && req.user.role !== "admin") {
      const error = new Error("No tens permís per editar aquesta meta!");
      error.statusCode = 403;
      throw error;
    }

    const data = {
      title: reqBody.title ?? foundMeta.title,
      description: reqBody.description ?? foundMeta.description,
      author_id: foundMeta.author_id,
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

    const foundMeta = await prisma.meta.findUnique({
      where: { id },
    });

    if (!foundMeta) {
      const error = new Error("No s'ha trobat la meta per eliminar!");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.id !== foundMeta.author_id && req.user.role !== "admin") {
      const error = new Error("No tens permís per eliminar aquesta meta!");
      error.statusCode = 403;
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
  getMetasByUserId, 
  createMeta,
  updateMeta,
  deleteMeta,
};
