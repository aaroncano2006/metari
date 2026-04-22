const prisma = require("../config/prisma");
const nodemailer = require("../config/nodemailer");
const utils = require("../helpers/Utils");
const {
  validateInvitation,
} = require("../middlewares/validators/validateInvitation");

const getInvitations = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userid);
    const status = req.params.status;
    const sentOrReceived = req.params.sentorreceived;

    if (isNaN(userId)) {
      const error = new Error("ID invàlida!");
      error.statusCode = 400;
      throw error;
    }

    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!foundUser) {
      const error = new Error("No s'ha trobat l'usuari!");
      error.statusCode = 404;
      throw error;
    }

    const validStatus = ["pending", "accepted", "rejected"];
    if (!validStatus.includes(status)) {
      const error = new Error("Estat de les peticions a consultar no vàlid!");
      error.statusCode = 400;
      throw error;
    }

    const validQueries = ["sent", "received"];
    if (!validQueries.includes(sentOrReceived)) {
      const error = new Error(
        "El valor especificat per consultar invitacions enviades o rebudes per part d'un usuari no és vàlid!",
      );
      error.statusCode = 400;
      throw error;
    }

    const invitations = await prisma.invitation.findMany({
      where:
        sentOrReceived === "sent"
          ? { sender_id: userId, status: status }
          : { receiver_id: userId, status: status },
      include: { sender: true, receiver: true, group: true },
    });

    res.status(200).json(utils.handleBigInt(invitations));
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const sendInvitations = async (req, res, next) => {
  try {
    const senderId = parseInt(req.params.senderid);
    const receiverId = parseInt(req.params.receiverid);
    const groupId = req.params.groupid ? parseInt(req.params.groupid) : null;

    const data = {
      sender_id: senderId,
      receiver_id: receiverId,
      group_id: groupId,
    };

    if (isNaN(data.sender_id) || isNaN(data.receiver_id)) {
      const error = new Error("IDs no vàlids");
      error.statusCode = 400;
      throw error;
    }

    const validate = await validateInvitation(data);
    if (typeof validate === "string") {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const { sender, receiver, group } = validate;

    const invitation = await prisma.invitation.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        ...(groupId && {
          group: {
            connect: { id: groupId },
          },
        }),
      },
    });

    await nodemailer
      .sendMail({
        from: "Metari",
        to: receiver.email,
        subject: !group
          ? `${sender.name} (${sender.username}) t'ha enviat una sol·licitud d'amistat`
          : `${sender.name} (${sender.username}) t'ha enviat una sol·licitud per unir-se al grup ${group.name}`,

        html: !group
          ? `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Nova sol·licitud d'amistat</h2>

          <p>Hola, <strong>${receiver.name}</strong>!</p>

          <p>
            L'usuari <strong>${sender.name} (${sender.username})</strong>
            t'ha enviat una sol·licitud d'amistat.
          </p>

          <p>
            Pots acceptar o rebutjar-la des del teu panell d'invitacions.
          </p>

          <hr />
          <small style="color: #666;">
            Metari - Comunitats, objectius i connexions
          </small>
        </div>
        `
          : `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Nova invitació a grup</h2>

          <p>Hola, <strong>${receiver.name}</strong>!</p>

          <p>
            L'usuari <strong>${sender.name} (${sender.username})</strong>
            t'ha enviat una sol·licitud per unir-se al grup
            <strong>${group.name}</strong>.
          </p>

          <p>
            Pots revisar-la i decidir si vols unir-t'hi des del teu panell d'invitacions.
          </p>

          <hr />
          <small style="color: #666;">
            Metari - Comunitats, objectius i connexions
          </small>
        </div>
        `,
      })
      .catch((err) => console.log("Error enviant correu: " + err));

    return res.status(201).json(utils.handleBigInt(invitation));
  } catch (error) {
    console.error("Error en Prisma:", error);
    if (error.code === "P2002") {
      // return res.status(400).json({
      //   error: "Ja existeix una amb aquestes característiques!",
      // });
      error = new Error("Ja existeix una invitació amb aquestes característiques!");
      error.statusCode = 400;
    }
    next(error);
  }
};

const acceptInvitation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const receiverId = parseInt(req.params.receiverid); // S'haurà de refactoritzar més endavant per a JWT

    if (isNaN(id) || isNaN(receiverId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: { sender: true, receiver: true, group: true },
    });

    if (!invitation) {
      const error = new Error("No s'ha trobat la invitació");
      error.statusCode = 404;
      throw error;
    }

    if (receiverId !== invitation.receiver.id) {
      const error = new Error(
        "No has rebut aquesta invitació! No pots acceptar-la!",
      );
      error.statusCode = 400;
      throw error;
    }

    const acceptedInvitation = await prisma.invitation.update({
      where: { id },
      data: {
        status: "accepted",
      },
    });

    if (acceptedInvitation && acceptedInvitation.group_id) {
      await prisma.groupUser.create({
        data: {
          group: {
            connect: { id: acceptedInvitation.group_id },
          },
          user: {
            connect: { id: acceptedInvitation.receiver_id },
          },
        },
      });

      await prisma.invitation.delete({
        where: { id },
      });
    }

    const message = !invitation.group_id
      ? `${invitation.sender.name} (${invitation.sender.username}) i tu ja sou amics!`
      : `Ja formes part del grup ${invitation.group.name}!`;

    res.status(200).json({
      ok: true,
      message,
    });
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const rejectInvitation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.params.userid);

    if (isNaN(id) || isNaN(userId)) {
      const error = new Error("IDs invàlides!");
      error.statusCode = 400;
      throw error;
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: { sender: true, receiver: true, group: true },
    });

    if (!invitation) {
      const error = new Error("No s'ha trobat la invitació");
      error.statusCode = 404;
      throw error;
    }

    // const sender = await prisma.user.findUnique({
    //   where: { id: invitation.sender_id },
    // });

    const sender = invitation.sender;

    const receiver = invitation.receiver;

    if (userId !== sender.id && userId !== receiver.id) {
      const error = new Error(
        "No formes part d'aquest invitació! No pots rebutjar-la ni eliminar-la.",
      );
      error.statusCode = 400;
      throw error;
    }

    await prisma.invitation.delete({
      where: { id },
    });

    let message = "";
    if (userId === sender.id && invitation.status === "pending") {
      message = "Invitació eliminada!";
    } else if (userId === receiver.id && invitation.status === "pending") {
      message = "Invitació rebutjada!";
    } else if (userId === sender.id) {
      message = `${receiver.name} (${receiver.username}) i tu ja no sou amics!`;
    } else if (userId === receiver.id) {
      message = `${sender.name} (${sender.username}) i tu ja no sou amics!`;
    }

    res.status(200).json({
      ok: true,
      message,
    });
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

module.exports = {
  getInvitations,
  sendInvitations,
  acceptInvitation,
  rejectInvitation,
};
