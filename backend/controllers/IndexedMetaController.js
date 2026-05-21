const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const {
  validateIndexedMeta,
} = require("../middlewares/validators/validateIndexedMeta");

const getIndexedMetas = async (req, res, next) => {
  try {
    const indexedMetas = await prisma.indexedMeta.findMany({
      include: {
        meta: {
          include: {
            category: true,
            author: true,
          },
        },
        user: true,
      },
    });

    res.status(200).json(utils.handleBigInt(indexedMetas));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar l'índex de metas" });
    next(error);
  }
};

const getIndexedMetaById = async (req, res, next) => {
  try {
    const indexedMeta = await prisma.indexedMeta.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!indexedMeta) {
      return res.status(404).json({ error: "Índex de meta no trobat" });
    }

    res.status(200).json(utils.handleBigInt(indexedMeta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar l'índex de meta" });
    next(error);
  }
};

const createIndexedMeta = async (req, res, next) => {
  const reqBody = req.body;

  try {
    const metaId = parseInt(reqBody.meta_id);
    if (isNaN(metaId)) {
      const error = new Error("ID de meta invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const meta = await prisma.meta.findUnique({
      where: { id: metaId },
      include: {
        group: {
          include: {
            groupUsers: { where: { user_id: req.user.id } },
          },
        },
      },
    });

    if (!meta) {
      const error = new Error("Meta no trobada!");
      error.statusCode = 404;
      throw error;
    }

    const isAuthor = meta.author_id === req.user.id;
    const isGroupMember = meta.group?.groupUsers.some(
      (gu) => gu.role === "member" || gu.role === "moderator",
    );
    const isGroupOwner = meta.group?.owner_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isGroupMember && !isGroupOwner && !isAdmin) {
      const error = new Error("No tens permisos per proposar aquesta meta!");
      error.statusCode = 403;
      throw error;
    }

    const data = {
      user_id: req.user.id,
      meta_id: metaId,
      is_approved: null,
      is_community_approved: null,
    };

    const validate = await validateIndexedMeta(data);
    if (validate) {
        const error = new Error(validate);
        error.statusCode = 400;
        throw error;
    }

    const indexedMeta = await prisma.indexedMeta.create({
      data
    });

    res.status(201).json(utils.handleBigInt(indexedMeta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const updateIndexedMeta = async (req, res, next) => {
  const reqBody = req.body;

  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const existing = await prisma.indexedMeta.findUnique({
      where: { id },
      include: {
        meta: {
          include: {
            group: {
              include: {
                groupUsers: { where: { user_id: req.user.id } },
              },
            },
          },
        },
      },
    });

    if (!existing) {
      const error = new Error("Indexació no trobada!");
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = req.user.role === "admin";
    const group = existing.meta?.group;
    const isGroupOwner = group?.owner_id === req.user.id;
    const isGroupModerator = group?.groupUsers.some(
      (gu) => gu.role === "moderator",
    );
    const canApprove = isGroupOwner || isGroupModerator || isAdmin;

    const data = {};

    if (canApprove && reqBody.is_approved !== undefined) {
      data.is_approved = reqBody.is_approved;
    }

    if (isAdmin && reqBody.is_community_approved !== undefined) {
      data.is_community_approved = reqBody.is_community_approved;
    }

    if (Object.keys(data).length === 0) {
      const error = new Error("No tens permisos per fer cap canvi!");
      error.statusCode = 403;
      throw error;
    }

    const validate = await validateIndexedMeta(data, true);
    if (validate) {
        const error = new Error(validate);
        error.statusCode = 400;
        throw error;
    }

    const updatedIndexedMeta = await prisma.indexedMeta.update({
      where: { id },
      data,
    });

    res.status(200).json(utils.handleBigInt(updatedIndexedMeta));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const deleteIndexedMeta = async (req, res, next) => {
  try {
    const deleted = await prisma.indexedMeta.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al eliminar l'índex de meta" });
    next(error);
  }
};

module.exports = {
  getIndexedMetas,
  getIndexedMetaById,
  createIndexedMeta,
  updateIndexedMeta,
  deleteIndexedMeta,
};
