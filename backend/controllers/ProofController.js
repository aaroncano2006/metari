const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const path = require("path");
const fs = require("fs");
const { validateProof } = require("../middlewares/validators/validateProof");

const getProofs = async (req, res, next) => {
  try {
    const proofs = await prisma.proof.findMany({
      where: {
        OR: [
          { user_id: req.user.id },
          { assignation: { group: { owner_id: req.user.id } } },
          {
            assignation: {
              group: { groupUsers: { some: { user_id: req.user.id } } },
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });

    res.status(200).json(utils.handleBigInt(proofs));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const getProofById = async (req, res, next) => {
  try {
    const proof = await prisma.proof.findFirst({
      where: {
        id: parseInt(req.params.id),
        OR: [
          { user_id: req.user.id },
          { assignation: { group: { owner_id: req.user.id } } },
          {
            assignation: {
              group: { groupUsers: { some: { user_id: req.user.id } } },
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });

    if (!proof) {
      const error = new Error("Prova no trobada");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(proof));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const createProof = async (req, res, next) => {
  const reqBody = req.body;
  try {
    const assignationId = parseInt(reqBody.assignation_id);
    if (isNaN(assignationId)) {
      const error = new Error("ID d'assignació invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const assignation = await prisma.assignation.findUnique({
      where: { id: assignationId },
      include: {
        meta: true,
        group: {
          include: {
            groupUsers: { where: { user_id: req.user.id } },
          },
        },
      },
    });

    if (!assignation) {
      const error = new Error("Assignació no trobada");
      error.statusCode = 404;
      throw error;
    }

    const isAssignee = assignation.user_id === req.user.id;
    const isGroupOwner = assignation.group?.owner_id === req.user.id;
    const isGroupModerator = assignation.group?.groupUsers.some(
      (gu) => gu.role === "moderator",
    );
    const isAdmin = req.user.role === "admin";
    const isChallenge = assignation.meta?.type === "challenge";
    const isGroupMember = (assignation.group?.groupUsers?.length ?? 0) > 0;

    if (!isAssignee && !isGroupOwner && !isGroupModerator && !isAdmin && !(isChallenge && isGroupMember)) {
      const error = new Error(
        "No tens permisos per crear una prova en aquesta assignació",
      );
      error.statusCode = 403;
      throw error;
    }

    let data = null;

    if (reqBody.proof_type === "text") {
      data = {
        assignation_id: assignationId,
        user_id: req.user.id,
        proof: reqBody.proof,
        proof_type: "text",
        is_valid: false,
      };

      const validate = await validateProof(data);
      if (validate) {
        const error = new Error(validate);
        error.statusCode = 400;
        throw error;
      }

      const proof = await prisma.proof.create({
        data,
      });
      return res.status(201).json(utils.handleBigInt(proof));
    }

    if (reqBody.proof_type === "image") {
      if (!req.file) {
        const error = new Error("No s'ha adjuntat cap imatge");
        error.statusCode = 400;
        throw error;
      }

      data = {
        assignation_id: assignationId,
        user_id: req.user.id,
        proof: "",
        proof_type: "image",
        is_valid: false,
      };

      const validate = await validateProof(data);
      if (validate) {
        const error = new Error(validate);
        error.statusCode = 400;
        throw error;
      }

      const proof = await prisma.proof.create({
        data,
      });

      const ext = path.extname(req.file.originalname);
      const fileName = `${assignationId}_${proof.id}_${req.user.id}${ext}`;
      const destPath = path.join("uploads/proofs", fileName);
      await fs.promises.rename(req.file.path, destPath);

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
      include: {
        assignation: {
          include: {
            group: {
              include: {
                groupUsers: { where: { user_id: req.user.id } },
              },
            },
          },
        },
      },
    });
    if (!existingProof) {
      const error = new Error("Prova no trobada");
      error.statusCode = 404;
      throw error;
    }

    const isAuthor = existingProof.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";
    const group = existingProof.assignation?.group;
    const isGroupOwner = group?.owner_id === req.user.id;
    const isGroupModerator = group?.groupUsers.some(
      (gu) => gu.role === "moderator",
    );
    const canValidate = isGroupOwner || isGroupModerator || isAdmin;

    if (!isAuthor && !canValidate) {
      const error = new Error("No tens permisos per modificar aquesta prova");
      error.statusCode = 403;
      throw error;
    }

    const data = {};

    if (isAuthor) {
      data.proof = reqBody.proof ?? existingProof.proof;
      data.proof_type = reqBody.proof_type ?? existingProof.proof_type;
    }

    if (canValidate) {
      data.is_valid = reqBody.is_valid === "true" || reqBody.is_valid === true;
    }

    if (existingProof.proof_type === "image" && existingProof.proof) {
      if (reqBody.proof_type === "text" || req.file) {
        const oldFilePath = path.join(__dirname, "..", existingProof.proof);
        try {
          await fs.promises.access(oldFilePath);
          await fs.promises.unlink(oldFilePath);
        } catch {
          // file doesn't exist, nothing to clean up
        }
      }
    }
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${existingProof.assignation_id}_${req.params.id}_${req.user.id}${ext}`;
      const destPath = path.join("uploads/proofs", fileName);
      await fs.promises.rename(req.file.path, destPath);
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
    const proof = await prisma.proof.findUnique({
      where: { id },
      include: {
        assignation: {
          include: {
            group: {
              include: {
                groupUsers: { where: { user_id: req.user.id } },
              },
            },
          },
        },
      },
    });
    if (!proof) {
      const error = new Error("Prova no trobada");
      error.statusCode = 404;
      throw error;
    }

    const isAuthor = proof.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";
    const group = proof.assignation?.group;
    const isGroupOwner = group?.owner_id === req.user.id;
    const isGroupModerator = group?.groupUsers.some(
      (gu) => gu.role === "moderator",
    );
    const canDelete = isAuthor || isGroupOwner || isGroupModerator || isAdmin;

    if (!canDelete) {
      const error = new Error("No tens permisos per eliminar aquesta prova");
      error.statusCode = 403;
      throw error;
    }

    if (proof.proof_type === "image" && proof.proof) {
      const filePath = path.join(__dirname, "..", proof.proof);
      try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
      } catch {
        // file doesn't exist, nothing to clean up
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
