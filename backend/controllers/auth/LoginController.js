const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;
const prisma = require("../../config/prisma");
const utils = require("../../helpers/Utils");

const login = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = {
      email_or_username: reqBody.email_or_username,
      password: reqBody.password,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        OR: [
          {
            email: data.email_or_username,
          },
          {
            user: data.email_or_username,
          },
        ],
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isSamePassword = await utils.compareHash(
      data.password,
      existingUser.password,
    );

    if (!isSamePassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
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