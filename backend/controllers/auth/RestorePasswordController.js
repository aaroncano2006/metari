const prisma = require("../../config/prisma");
const nodemailer = require("../../config/nodemailer");
const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;
const { hash } = require("../../helpers/Utils");
const { validateRestorePassword } = require("../../middlewares/validators/auth/validateRestorePassword");

const forgotPassword = async (req, res, next) => {
  try {
    const email_or_username = req.body.email_or_username;

    if (!email_or_username) {
      const error = new Error("El nom d'usuari o email és obligatori!");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await prisma.user.findFirst({
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
      return res.status(404).json({ message: "Usuari no trobat!" });
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
            Clica en <a href="http://localhost:5173/restore-password?token=${token}">el següent enllaç</a> per restaurar la teva contrasenya!
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
          id: existingUser.id
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

const restorePassword = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const data = {
          token: reqBody.token,
          new_password: reqBody.new_password,
          confirm_password: reqBody.confirm_password,
        };

        const validate = await validateRestorePassword(data);
        if (validate) {
          const error = new Error(validate);
          error.statusCode = 400;
          throw error;
        }

        const token = data.token;
        const newPassword = data.new_password;

        let payload = null;
        try {
            payload = jwt.verify(token, SECRET);
        } catch (err) {
            throw err;
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                id: payload.id,
                restore_token: token
            }
        });

        if (!existingUser) {
            const error = new Error("L'usuari al qual pertany el token no existeix!");
            error.statusCode = 404;
            throw error;
        }

        const hashedPassword = await hash(newPassword);

        await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                password: hashedPassword,
                restore_token: null
            }
        });

        return res.status(200).json({
            message: "Contrasenya actualitzada correctament!"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
  forgotPassword,
  restorePassword,
};
