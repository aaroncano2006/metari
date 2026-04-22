const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const getIndexedMetas = async (req, res, next) => {
    try {
        const indexedMetas = await prisma.indexedMeta.findMany();

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

    if ((reqBody.group_id && reqBody.user_id) || (!reqBody.group_id && !reqBody.user_id)) {
        return res.status(400).json({
            error: "You must provide either group_id or user_id, but not both or neither.",
        });
    }

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
        // res.status(500).json({ error: "Error al crear l'índex de meta" });
        next(error);

    }
};

const updateIndexedMeta = async (req, res, next) => {
    const reqBody = req.body;

    if ((reqBody.group_id && reqBody.user_id) || (!reqBody.group_id && !reqBody.user_id)) {
        return res.status(400).json({
            error: "You must provide either group_id or user_id, but not both or neither.",
        });
    }

    try {
        const updatedIndexedMeta = await prisma.indexedMeta.update({
            where: { id: parseInt(req.params.id) },
            data: {
                user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                meta_id: parseInt(reqBody.meta_id),
                group_id: reqBody.group_id ? parseInt(reqBody.group_id) : null,
                is_public: reqBody.is_public,
                is_approved: reqBody.is_approved,
                is_community_approved: reqBody.is_community_approved,
            },
        });

        res.status(200).json(utils.handleBigInt(updatedIndexedMeta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al actualitzar l'índex de meta" });
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
