const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

//Get all
const getUsuaris = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(utils.handleBigInt(users));
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al carregar usuaris" });
  }
};

// Get by id (/api/users/1)
const getUsuariById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // // Si el parametre de la busqueda is NaN, error  exemple: (/api/users/asdas)
    // if (isNaN(id)) {
    //     return res.status(400).json({ error: "ID invàlid" });
    // }

    const user = await prisma.user.findUnique({
      // where: { id: id },
      where: { id },
    });

    // // Si la res no troba l'usuari (404), error.
    // if (!user) {
    //     return res.status(404).json({ error: "Usuari no trobat" });
    // }

    res.status(200).json(utils.handleBigInt(user));
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al trobar l'usuari" });
  }
};

//Crea un usuari
const createUsuari = async (req, res) => {
  // const { name, userName, password, email } = req.body;.
  const userBody = req.body;
  const userPassword = await utils.hash(userBody.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: userBody.name,
        username: userBody.username,
        email: userBody.email,
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
    res.status(500).json({ error: "Error al crear l'usuari" });
  }
};

//Actualitza Usuari
const updateUsuari = async (req, res) => {
  try {
    const reqBody = req.body;
    const id = parseInt(req.params.id);
    const foundUser = await prisma.user.findUnique({
      where: { id },
    });

    const dataToUpdate = {
      name: reqBody.name,
      username: reqBody.username,
      email: reqBody.email,
      role: reqBody.role,
      completed_tasks:
        reqBody.completed_tasks !== undefined
          ? parseInt(reqBody.completed_tasks)
          : undefined,
      score: reqBody.score !== undefined ? parseInt(reqBody.score) : undefined,
      restore_token: reqBody.restore_token,
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
    res.status(500).json({ error: "Error al actualitzar l'usuari" });
  }
};

// Delete user (/api/users/1)
const deleteUsuari = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).json({ message: "Usuari eliminat correctament" });
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error al eliminar l'usuari" });
  }
};

module.exports = {
  getUsuaris,
  getUsuariById,
  createUsuari,
  updateUsuari,
  deleteUsuari,
};
