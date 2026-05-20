const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const path = require("path");
const fs = require("fs");



const getProofs = async (req, res, next) => {
    try {
        const proofs = await prisma.proof.findMany({
            include: {
                user: true
            }
        });

        res.status(200).json(utils.handleBigInt(proofs));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al carregar proves" });
        next(error);

    }
};

const getProofById = async (req, res, next) => {
    try {
        const proof = await prisma.proof.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: true
            }
        });

        if (!proof) {
            return res.status(404).json({ error: "Prova no trobada" });
        }

        res.status(200).json(utils.handleBigInt(proof));
    } catch (error) {
        console.error("Error en Prisma:", error);
        // res.status(500).json({ error: "Error al carregar la prova" });
        next(error);

    }
};



const createProof = async (req, res, next) => {
    const reqBody = req.body;
    try {
        // per text 
        if (reqBody.proof_type === "text") {
            const proof = await prisma.proof.create({
                data: {
                    assignation_id: parseInt(reqBody.assignation_id),
                    user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                    proof: reqBody.proof,
                    proof_type: "text",
                    is_valid: false,
                },
            });
            return res.status(201).json(utils.handleBigInt(proof));
        }
        // per imatge
        if (reqBody.proof_type === "image") {
            if (!req.file) {
                const error = new Error("No s'ha adjuntat cap imatge");
                error.statusCode = 400;
                throw error;
            }

            const proof = await prisma.proof.create({
                data: {
                    assignation_id: parseInt(reqBody.assignation_id),
                    user_id: reqBody.user_id ? parseInt(reqBody.user_id) : null,
                    proof: "",
                    proof_type: "image",
                    is_valid: false,
                },
            });
            // renombrem l'arxiu
            const ext = path.extname(req.file.originalname);
            const fileName = `${reqBody.assignation_id}_${proof.id}_${reqBody.user_id}${ext}`;
            const destPath = path.join("uploads/proofs", fileName);
            fs.renameSync(req.file.path, destPath);
            // 3. Actualitzar registre amb el path
            const updatedProof = await prisma.proof.update({
                where: { id: proof.id },
                data: { proof: `/uploads/proofs/${fileName}` },
            });
            return res.status(201).json(utils.handleBigInt(updatedProof));
        }
        const error = new Error("Tipus de prova no vàlid");
        error.statusCode = 400;
        throw error;
    } catch (error) {
        console.error("Error en Prisma:", error);
        next(error);
    }
};



const updateProof = async (req, res, next) => {
    const reqBody = req.body;
    try {
        const existingProof = await prisma.proof.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!existingProof) {
            const error = new Error("Prova no trobada");
            error.statusCode = 404;
            throw error;
        }
        const data = {
            proof: reqBody.proof,
            proof_type: reqBody.proof_type,
            is_valid: reqBody.is_valid === "true" || reqBody.is_valid === true,
        };
        // esborrar imatge si es canvia a text o es posa una nova
        if (existingProof.proof_type === "image" && existingProof.proof) {
            if (reqBody.proof_type === "text" || req.file) {
                const oldFilePath = path.join(__dirname, "..", existingProof.proof);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const fileName = `${reqBody.assignation_id}_${req.params.id}_${reqBody.user_id}${ext}`;
            const destPath = path.join("uploads/proofs", fileName);
            fs.renameSync(req.file.path, destPath);
            data.proof = `/uploads/proofs/${fileName}`;
        }
        const updatedProof = await prisma.proof.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.status(200).json(utils.handleBigInt(updatedProof));
    } catch (error) {
        console.error("Error en Prisma:", error);
        next(error);
    }
};

const deleteProof = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const proof = await prisma.proof.findUnique({ where: { id } });
        if (!proof) {
            const error = new Error("Prova no trobada");
            error.statusCode = 404;
            throw error;
        }
        // Esborrar l'arxiu si és una imatge
        if (proof.proof_type === "image" && proof.proof) {
            const filePath = path.join(__dirname, "..", proof.proof);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await prisma.proof.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        console.error("Error en Prisma:", error);
        next(error);
    }
};

module.exports = {
    getProofs,
    getProofById,
    createProof,
    updateProof,
    deleteProof,
};


