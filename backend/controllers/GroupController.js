const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

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
        next(error);
    }
};

const createGroup = async (req, res, next) => {
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
        next(error);
    }
};

const updateGroup = async (req, res, next) => {
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
        next(error);
    }
};

const deleteGroup = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.group.delete({
            where: { id },
        });
        res.status(204).json({ message: "Grup eliminat correctament" });
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