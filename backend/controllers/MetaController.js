const prisma = require("../config/prisma");


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

const createMeta = async (req, res) => {
    const reqBody = req.body;

    try {       
        const meta = await prisma.meta.create({
            data: {
                title: reqBody.title,
                description: reqBody.description,
                author_id: parseInt(reqBody.author_id),
                group_id: parseInt(reqBody.group_id),
                type: reqBody.type,

            },
        });        
        res.status(201).json(handleBigInt(meta));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al crear la meta" });
    }
};

module.exports = {
    getMetas,
    createMeta,
};