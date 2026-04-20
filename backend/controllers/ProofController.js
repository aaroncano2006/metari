const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");



const getProofs = async (req, res) => {
    try {
        const proofs = await prisma.proof.findMany();

        res.status(200).json(utils.handleBigInt(proofs));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar proves" });
    }
};

const getProofById = async (req, res) => {
    try {
        const proof = await prisma.proof.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!proof) {
            return res.status(404).json({ error: "Prova no trobada" });
        }

        res.status(200).json(utils.handleBigInt(proof));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar la prova" });
    }
};

const createProof = async (req, res) => {
    const reqBody = req.body;

    try {
        const proof = await prisma.proof.create({
            data: {
                assignation_id: parseInt(reqBody.assignation_id),
                user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                proof: reqBody.proof,
                is_valid: reqBody.is_valid ?? false,
            },
        });

        res.status(201).json(utils.handleBigInt(proof));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al crear la prova" });
    }
};

const updateProof = async (req, res) => {
    const reqBody = req.body;

    try {
        const updatedProof = await prisma.proof.update({
            where: { id: parseInt(req.params.id) },
            data: {
                assignation_id: reqBody.assignation_id
                    ? parseInt(reqBody.assignation_id)
                    : undefined,
                user_id: reqBody.user_id
                    ? parseInt(reqBody.user_id)
                    : undefined,
                proof: reqBody.proof,
                is_valid: reqBody.is_valid,
            },
        });

        res.status(200).json(utils.handleBigInt(updatedProof));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al actualitzar la prova" });
    }
};

const deleteProof = async (req, res) => {
    try {
        const proof = await prisma.proof.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.status(200).json(utils.handleBigInt(proof));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al eliminar la prova" });
    }
};

module.exports = {
  getProofs,
  getProofById,
  createProof,
  updateProof,
  deleteProof,
};


