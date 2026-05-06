const primsa = require("../../config/prisma");
const nodemailer = require("../../config/nodemailer");
const prisma = require("../../config/prisma");
const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;

const forgotPassword = async (req, res, next) => {
  try {
    const email_or_username = req.body.email_or_username;

    if (!email_or_username) {
      const error = new Error("El nom d'usuari o email és obligatori!");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        OR: [
          {
            email: email_or_username,
          },
          {
            username: email_or_username,
          },
        ],
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
      SECRET,
      { expiresIn: "1h" },
    );

    try {
      await nodemailer.sendMail({
        from: "Metari",
        to: existingUser.email,
        subject: "Recupera l'accés a Metari!",

        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Recupera l'accés a Metari!</h2>

          <p>Hola, <strong>${existingUser.name}</strong>!</p>

          <p>
            Clica en <a href="#">el següent enllaç</a> per restaurar la teva contrasenya!
          </p>

          <hr />
          <small style="color: #666;">
            Metari - Comunitats, objectius i connexions
          </small>
        </div>
        `,
      });

      const updatedUser = await prisma.user.update({
        where: {
          OR: [
            {
              email: email_or_username,
            },
            {
              username: email_or_username,
            },
          ],
        },
        data: {
          restore_token: token,
        },
      });
    } catch (err) {
        throw err;
    }

    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const restorePassword = async (req, res, next) => {};

module.exports = {
  forgotPassword,
  restorePassword,
};
