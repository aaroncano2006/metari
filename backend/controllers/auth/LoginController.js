const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;
const prisma = require("../../config/prisma");
const utils = require("../../helpers/Utils");
const { validateLogin } = require("../../middlewares/validators/auth/validateLogin");

const login = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = {
      email_or_username: reqBody.email_or_username,
      password: reqBody.password,
    };

    const validate = await validateLogin(data);
    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email_or_username,
          },
          {
            username: data.email_or_username,
          },
        ],
      },
    });

    if (!existingUser) {
      const error = new Error("Usuari no trobat!");
      error.statusCode = 404;
      throw error;
    }

    const isSamePassword = await utils.compareHash(
      data.password,
      existingUser.password,
    );

    if (!isSamePassword) {
      const error = new Error("Contrasenya incorrecta!");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
        completed_tasks: utils.handleBigInt(existingUser.completed_tasks),
        score: utils.handleBigInt(existingUser.score)
      },
      SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    login
};