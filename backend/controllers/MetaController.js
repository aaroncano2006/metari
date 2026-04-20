const prisma = require("../config/prisma");
const utils = require("../helpers/Utils") 

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
    const id = parseInt(req.params.id);
    try {
        const meta = await prisma.meta.findUnique({
            where: { id },
            
        });
        res.status(200).json(utils.handleBigInt(meta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        next(error);
    }
};

const createMeta = async (req, res, next) => {
    const reqBody = req.body;

    try {       
        const meta = await prisma.meta.create({
            data: {
                title: reqBody.title,
                description: reqBody.description,
                author_id: parseInt(reqBody.author_id),
                group_id: parseInt(reqBody.group_id),
                // type: "reqBody.type,"

            },
        });        
        res.status(201).json(utils.handleBigInt(meta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        next(error);
    }
};

const updateMeta = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const reqBody = req.body;
    try {
        const meta = await prisma.meta.update({
            where: { id },
            data: {
                title: reqBody.title,
                description: reqBody.description,
                author_id: parseInt(reqBody.author_id),
                group_id: parseInt(reqBody.group_id),
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
    const id = parseInt(req.params.id);
    try {
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