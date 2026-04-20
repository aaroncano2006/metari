const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");



const getGroupUsers = async (req, res) => {
    try {
        const groupUsers = await prisma.groupUser.findMany();

        res.status(200).json(utils.handleBigInt(groupUsers));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar relacions grup-usuari" });
    }
};


const createGroupUser = async (req, res) => {
    const reqBody = req.body;

    try {
        const groupUser = await prisma.groupUser.create({
            data: {
                group_id: parseInt(reqBody.group_id),
                user_id: parseInt(reqBody.user_id),
                role: reqBody.role ?? "member",
            },
        });

        res.status(201).json(utils.handleBigInt(groupUser));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al afegir usuari al grup" });
    }
};

const getGroupUser = async (req, res) => {
    try {
        const { group_id, user_id } = req.params;

        const groupUser = await prisma.groupUser.findUnique({
            where: {
                group_id_user_id: {
                    group_id: parseInt(group_id),
                    user_id: parseInt(user_id),
                },
            },
        });

        if (!groupUser) {
            return res.status(404).json({ error: "Relació no trobada" });
        }

        res.status(200).json(utils.handleBigInt(groupUser));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar la relació" });
    }
};

const updateGroupUser = async (req, res) => {
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
        });

        res.status(200).json(utils.handleBigInt(updatedGroupUser));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al actualitzar la relació" });
    }
};

const deleteGroupUser = async (req, res) => {
    try {
        const deleted = await prisma.groupUser.delete({
            where: {
                group_id_user_id: {
                    group_id: parseInt(req.params.group_id),
                    user_id: parseInt(req.params.user_id),
                },
            },
        });

        res.status(200).json(utils.handleBigInt(deleted));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al eliminar la relació" });
    }
};

module.exports = {
  getGroupUsers,
  getGroupUser,
  createGroupUser,
  updateGroupUser,
  deleteGroupUser,
};
