const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const getIndexedMetas = async (req, res) => {
    try {
        const indexedMetas = await prisma.indexedMeta.findMany();

        res.status(200).json(utils.handleBigInt(indexedMetas));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar l'índex de metas" });
    }
};

const getIndexedMetaById = async (req, res) => {
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
        res.status(500).json({ error: "Error al carregar l'índex de meta" });
    }
};

const createIndexedMeta = async (req, res) => {
    const reqBody = req.body;

    try {
        const indexedMeta = await prisma.indexedMeta.create({
            data: {
                user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                meta_id: parseInt(reqBody.meta_id),
                group_id: reqBody.group_id ? parseInt(reqBody.group_id) : null,
                is_public: reqBody.is_public ?? false,
                is_approved: reqBody.is_approved ?? null,
                is_community_approved: reqBody.is_community_approved ?? null,
            },
        });

        res.status(201).json(utils.handleBigInt(indexedMeta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al crear l'índex de meta" });
    }
};

const updateIndexedMeta = async (req, res) => {
    const reqBody = req.body;

    try {
        const updatedIndexedMeta = await prisma.indexedMeta.update({
            where: { id: parseInt(req.params.id) },
            data: {
                user_id: reqBody.user_id ? parseInt(reqBody.user_id) : undefined,
                meta_id: reqBody.meta_id ? parseInt(reqBody.meta_id) : undefined,
                group_id: reqBody.group_id ? parseInt(reqBody.group_id) : undefined,
                is_public: reqBody.is_public,
                is_approved: reqBody.is_approved,
                is_community_approved: reqBody.is_community_approved,
            },
        });

        res.status(200).json(utils.handleBigInt(updatedIndexedMeta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al actualitzar l'índex de meta" });
    }
};

const deleteIndexedMeta = async (req, res) => {
    try {
        const deleted = await prisma.indexedMeta.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.status(200).json(utils.handleBigInt(deleted));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al eliminar l'índex de meta" });
    }
};

module.exports = {
  getIndexedMetas,
  getIndexedMetaById,
  createIndexedMeta,
  updateIndexedMeta,
  deleteIndexedMeta,
};
