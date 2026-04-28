const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");
const { validateUser } = require("../middlewares/validators/validateUser");

//Get all
const getUsuaris = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(utils.handleBigInt(users));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

// Get by id (/api/users/1)
const getUsuariById = async (req, res, next) => {
  try {
    // // Si el parametre de la busqueda is NaN, error  exemple: (/api/users/asdas)
    // if (isNaN(id)) {
    //     return res.status(400).json({ error: "ID invàlid" });
    // }
    const id = parseInt(req.params.id);

    // Evita errors per peticions amb identificadors no vàlids /api/usuaris/xd
    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      // where: { id: id },
      where: { id },
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
  // const { name, userName, password, email } = req.body;.

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

    const validate = await validateUser(reqBody, id);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const dataToUpdate = {
      name: reqBody.name ?? foundUser.name,
      username: reqBody.username ?? foundUser.username,
      email: reqBody.email ?? foundUser.email,
      role: reqBody.role ?? foundUser.role,
      restore_token: reqBody.restore_token ?? foundUser.restore_token,
      completed_tasks:
        reqBody.completed_tasks !== undefined
          ? parseInt(reqBody.completed_tasks)
          : foundUser.completed_tasks,
      score:
        reqBody.score !== undefined ? parseInt(reqBody.score) : foundUser.score,
    };

    let isSamePass = false;
    if (reqBody.password) {
      isSamePass = await utils.compareHash(
        reqBody.password,
        foundUser.password,
      );

      if (!isSamePass)
        dataToUpdate.password = await utils.hash(reqBody.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json(utils.handleBigInt(user));
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
