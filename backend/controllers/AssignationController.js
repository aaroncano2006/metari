const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

// GET ALL
const getAssignations = async (req, res) => {
  try {
    const assignations = await prisma.assignation.findMany();
    res.status(200).json(utils.handleBigInt(assignations));
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al carregar assignacions" });
  }
};

const getAssignationById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignation = await prisma.assignation.findUnique({
      where: { id: Number(id) },
      // include: {
      //   group: true,
      //   meta: true,
      //   user: true,
      //   comments: true,
      //   proofs: true,
      // }
    });

    res.status(200).json(utils.handleBigInt(assignation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al carregar assignació" });
  }
};

const createAssignation = async (req, res) => {
    const reqBody = req.body;

    try {
        const assignation = await prisma.assignation.create({
            data: {
                group_id: reqBody.group_id ? parseInt(reqBody.group_id) : null,
                meta_id: reqBody.meta_id ? parseInt(reqBody.meta_id) : null,
                user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                start_date: reqBody.start_date,
                due_date: reqBody.due_date,
                priority: reqBody.priority,
                difficulty: reqBody.difficulty ?? "normal",
                score: reqBody.score ? BigInt(reqBody.score) : null,
                completed: reqBody.completed ?? false,
            },
        });

        res.status(201).json(utils.handleBigInt(assignation));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al crear assignació" });
    }
};


const updateAssignation = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAssignation = await prisma.assignation.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.status(200).json(utils.handleBigInt(updatedAssignation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al actualitzar assignació" });
  }
};

const deleteAssignation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.assignation.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Assignació eliminada correctament" });
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al eliminar assignació" });
  }
};

module.exports = {
  getAssignations,
  getAssignationById,
  createAssignation,
  updateAssignation,
  deleteAssignation,
};


