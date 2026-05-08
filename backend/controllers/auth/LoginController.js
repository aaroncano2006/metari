const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;
const prisma = require("../../config/prisma");
const utils = require("../../helpers/Utils");

const login = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = {
      email_or_username: reqBody.email_or_username,
      password: String(reqBody.password),
    };

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
      return res.status(404).json({ message: "Usuari no trobat!" });
    }

    const isSamePassword = await utils.compareHash(
      data.password,
      existingUser.password,
    );

    if (!isSamePassword) {
      return res.status(400).json({ message: "Contrasenya incorrecta!" });
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