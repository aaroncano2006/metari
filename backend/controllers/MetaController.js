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
    const body = req.body;

    try {       
        const meta = await prisma.meta.create({
            data: {
                title: body.title,
                description: body.description,
                author_id: parseInt(body.author_id),
                group_id: parseInt(body.group_id),
                type: body.type,

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