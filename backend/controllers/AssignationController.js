const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

// GET ALL
const getAssignations = async (req, res, next) => {
  try {
    const assignations = await prisma.assignation.findMany();
    res.status(200).json(utils.handleBigInt(assignations));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al carregar assignacions" });
    next(error);
  }
};

const getAssignationById = async (req, res, next) => {
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
    next(error);

  }
};

const createAssignation = async (req, res, next) => {
    const reqBody = req.body;

    // si els 2 estan definits o ningun esta definit, error
    if ((reqBody.group_id && reqBody.user_id) || (!reqBody.group_id && !reqBody.user_id)) {
        return res.status(400).json({
            error: "You must provide either group_id or user_id, but not both or neither.",
        });
    }

    try {
        const assignation = await prisma.assignation.create({
            data: {
                group_id: reqBody.group_id ? parseInt(reqBody.group_id) : null,
                meta_id: parseInt(reqBody.meta_id),
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
        // res.status(500).json({ error: "Error al crear assignació" });
        next(error);

    }
};


const updateAssignation = async (req, res, next) => {
  const reqBody = req.body;
  const { id } = req.params;

  if ((reqBody.group_id && reqBody.user_id) || (!reqBody.group_id && !reqBody.user_id)) {
        return res.status(400).json({
            error: "You must provide either group_id or user_id, but not both or neither.",
        });
    }

  try {

    const updatedAssignation = await prisma.assignation.update({
      where: { id: Number(id) },
      data: {
                group_id: reqBody.group_id ? parseInt(reqBody.group_id) : null,
                meta_id: parseInt(reqBody.meta_id),
                user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                start_date: reqBody.start_date,
                due_date: reqBody.due_date,
                priority: reqBody.priority,
                difficulty: reqBody.difficulty ?? "normal",
                score: reqBody.score ? BigInt(reqBody.score) : null,
                completed: reqBody.completed ?? false,
            },
    });

    res.status(200).json(utils.handleBigInt(updatedAssignation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error al actualitzar assignació" });
    next(error);

  }
};

const deleteAssignation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.assignation.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Assignació eliminada correctament" });
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);

  }
};

module.exports = {
  getAssignations,
  getAssignationById,
  createAssignation,
  updateAssignation,
  deleteAssignation,
};


