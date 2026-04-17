const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const getGroups = async (req, res) => {
    try {
        const groups = await prisma.group.findMany();
        res.status(200).json(utils.handleBigInt(groups));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar grups" });
    }
};

const getGroupById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
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
        res.status(200).json(utils.handleBigInt(group));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al trobar el grup" });
    }
};

const createGroup = async (req, res) => {
    const reqBody = req.body;
    try {
        const group = await prisma.group.create({
            data: {
                name: reqBody.name,
                description: reqBody.description,
                owner_id: parseInt(reqBody.owner_id),
                is_public: reqBody.is_public ?? true,
            },
        });
        res.status(201).json(utils.handleBigInt(group));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al crear el grup" });
    }
};

const updateGroup = async (req, res) => {
    const id = parseInt(req.params.id);
    const reqBody = req.body;
    try {
        const group = await prisma.group.update({
            where: { id },
            data: {
                name: reqBody.name,
                description: reqBody.description,
                owner_id: reqBody.owner_id !== undefined ? parseInt(reqBody.owner_id) : undefined,
                is_public: reqBody.is_public,
            },
        });
        res.status(200).json(utils.handleBigInt(group));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al actualitzar el grup" });
    }
};

const deleteGroup = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.group.delete({
            where: { id },
        });
        res.status(204).json({ message: "Grup eliminat correctament" });
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al eliminar el grup" });
    }
};

module.exports = {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
};