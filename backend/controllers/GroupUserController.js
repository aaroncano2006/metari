const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");



const getGroupUsers = async (req, res, next) => {
    try {
        const groupUsers = await prisma.groupUser.findMany({
            include: {
                group: true, user: true
            }
        });

        res.status(200).json(utils.handleBigInt(groupUsers));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al carregar relacions grup-usuari" });
        next(error);

    }
};


const createGroupUser = async (req, res, next) => {
    const reqBody = req.body;

    try {
        const groupUser = await prisma.groupUser.create({
            data: {
                group_id: parseInt(reqBody.group_id),
                user_id: parseInt(reqBody.user_id),
                role: reqBody.role ?? "member",
            },
            include: {
                group: true, user: true
            }
        });

        res.status(201).json(utils.handleBigInt(groupUser));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al afegir usuari al grup" });
        next(error);

    }
};

const getGroupUser = async (req, res, next) => {
    try {
        const { group_id, user_id } = req.params;

        const groupUser = await prisma.groupUser.findUnique({
            where: {
                group_id_user_id: {
                    group_id: parseInt(group_id),
                    user_id: parseInt(user_id),
                    
                },
            },
            include: {
                group: true, user: true
            }
        });

        if (!groupUser) {
            return res.status(404).json({ error: "Relació no trobada" });
        }

        res.status(200).json(utils.handleBigInt(groupUser));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al carregar la relació" });
        next(error);

    }
};

const updateGroupUser = async (req, res, next) => {
    const reqBody = req.body;

    try {
        const updatedGroupUser = await prisma.groupUser.update({
            where: {
                group_id_user_id: {
                    group_id: parseInt(req.params.group_id),
                    user_id: parseInt(req.params.user_id),
                },
            },
            data: {
                role: reqBody.role,
            },
            include: {
                group: true, user: true
            }
        });

        res.status(200).json(utils.handleBigInt(updatedGroupUser));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al actualitzar la relació" });
        next(error);

    }
};

const deleteGroupUser = async (req, res, next) => {
    try {
        const deleted = await prisma.groupUser.delete({
            where: {
                group_id_user_id: {
                    group_id: parseInt(req.params.group_id),
                    user_id: parseInt(req.params.user_id),
                },
            },
        });

        res.status(204).end();
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al eliminar la relació" });
        next(error);

    }
};

module.exports = {
    getGroupUsers,
    getGroupUser,
    createGroupUser,
    updateGroupUser,
    deleteGroupUser,
};
