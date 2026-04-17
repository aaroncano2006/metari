const prisma = require("../config/prisma");
const utils = require("./Utils") 


//pendent comprobar si fa falta handlebigint aqui.



//Get all
const getMetas = async (req, res) => {
    try {
        const metas = await prisma.meta.findMany();
        res.status(200).json(metas);
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar metas" });
    }
};

const getMetaById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const meta = await prisma.meta.findUnique({
            where: { id },
            
        });
        res.status(200).json(utils.handleBigInt(meta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al trobar la meta" });
    }
};

const createMeta = async (req, res) => {
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
        res.status(500).json({ error: "Error al crear la meta" });
    }
};

const updateMeta = async (req, res) => {
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
        res.status(500).json({ error: "Error al actualitzar la meta" });
    }
};

const deleteMeta = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.meta.delete({
            where: { id },
        });
        res.status(204).json({ message: "Meta eliminada correctament" });
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al eliminar la meta" });
    }
};


module.exports = {
    getMetas,
    getMetaById,
    createMeta,
    updateMeta,
    deleteMeta,
};