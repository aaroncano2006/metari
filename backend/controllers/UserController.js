const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const jwt = require("jsonwebtoken");
const SECRET = require("../config/auth").SECRET;
const { validateUser } = require("../middlewares/validators/validateUser");

//Get all
const getUsuaris = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
        restore_token: true
      }
    });
    res.status(200).json(utils.handleBigInt(users));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

// Get by id (/api/users/1)
const getUsuariById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Evita errors per peticions amb identificadors no vàlids /api/usuaris/xd
    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        restore_token: true
      }
    });

    if (!user) {
      const error = new Error("No s'ha trobat l'usuari!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(utils.handleBigInt(user));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

//Crea un usuari
const createUsuari = async (req, res, next) => {

  try {
    const reqBody = req.body;
    const validate = await validateUser(reqBody);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }
    const userPassword = await utils.hash(reqBody.password);

    const user = await prisma.user.create({
      data: {
        name: reqBody.name,
        username: reqBody.username,
        email: reqBody.email,
        password: userPassword,
        role: "user",
        completed_tasks: 0,
        score: 0,
        restore_token: null,
      },
      omit: {
        password: true,
        restore_token: true,
      },
    });
    res.status(201).json(utils.handleBigInt(user));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

//Actualitza Usuari
const updateUsuari = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const foundUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) {
      const error = new Error("No s'ha trobat l'usuari a actualitzar");
      error.statusCode = 404;
      throw error;
    }

    const isOwner = req.user.id === id;
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      const error = new Error("No tens permís per actualitzar aquest usuari");
      error.statusCode = 403;
      throw error;
    }

    const dataToUpdate = {
      name: reqBody.name ?? foundUser.name,
      username: reqBody.username ?? foundUser.username,
      email: reqBody.email ?? foundUser.email,
    };

    if (isAdminUser) {
      if (reqBody.role) dataToUpdate.role = reqBody.role;
      if (reqBody.completed_tasks !== undefined)
        dataToUpdate.completed_tasks = parseInt(reqBody.completed_tasks);
      if (reqBody.score !== undefined)
        dataToUpdate.score = parseInt(reqBody.score);
    }

    if (reqBody.password) {
      const isSamePass = await utils.compareHash(
        reqBody.password,
        foundUser.password,
      );
      if (!isSamePass)
        dataToUpdate.password = await utils.hash(reqBody.password);
    }

    const validate = await validateUser(dataToUpdate, id);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true, name: true, username: true, email: true,
        role: true, completed_tasks: true, score: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        completed_tasks: utils.handleBigInt(user.completed_tasks),
        score: utils.handleBigInt(user.score),
      },
      SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({ user: utils.handleBigInt(user), token });
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

// Delete user (/api/users/1)
const deleteUsuari = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    await prisma.user.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

module.exports = {
  getUsuaris,
  getUsuariById,
  createUsuari,
  updateUsuari,
  deleteUsuari,
};
