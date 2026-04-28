const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");


const getComments = async (req, res, next) => {
    try {
        const comments = await prisma.comment.findMany();

        res.status(200).json(utils.handleBigInt(comments));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al carregar comentaris" });
    next(error);

    }
};



const getCommentById = async (req, res, next) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        res.status(200).json(utils.handleBigInt(comment));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al carregar el comentari" });
        next(error);

    }
};

const createComment = async (req, res, next) => {
    const reqBody = req.body;

    try {
        const comment = await prisma.comment.create({
            data: {
                assignation_id: parseInt(reqBody.assignation_id),
                user_id: parseInt(reqBody.user_id),
                body: reqBody.body,
            },
        });

        res.status(201).json(utils.handleBigInt(comment));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al crear el comentari" });
        next(error);

    }
};


const updateComment = async (req, res, next) => {
    const reqBody = req.body;

    try {
        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(req.params.id) },
            data: {
                assignation_id: reqBody.assignation_id
                    ? parseInt(reqBody.assignation_id)
                    : undefined,
                user_id: reqBody.user_id
                    ? parseInt(reqBody.user_id)
                    : undefined,
                body: reqBody.body,
            },
        });

        res.status(200).json(utils.handleBigInt(updatedComment));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al actualitzar el comentari" });
        next(error);

    }
};

const deleteComment = async (req, res, next) => {
    try {
        const comment = await prisma.comment.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.status(204).end();
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al eliminar el comentari" });
        next(error);

    }
};


module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
};


