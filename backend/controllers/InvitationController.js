const prisma = require("../config/prisma");
const nodemailer = require("../config/nodemailer");

const handleBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );

const getInvitations = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userid);
    const status = req.params.status;

    const invitations = await prisma.invitation.findMany({
      where: { receiver_id: userId, status: status },
      include: { sender: true, receiver: true, group: true },
    });

    res.status(200).json(handleBigInt(invitations));
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

    if (senderId === receiverId) {
      const error = new Error("No et pots enviar sol·licitud d'amistat a tu mateix!");
      error.statusCode = 400;
      throw error;
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    const group = groupId
      ? await prisma.group.findUnique({
          where: { id: groupId },
        })
      : null;

    if (!sender || !receiver) {
      const error = new Error("Usuari no trobat!");
      error.statusCode = 404;
      throw error;
    }

    const invitation = await prisma.invitation.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        ...(groupId && {
          group: {
            connect: { id: groupId },
          },
        }),
      },
    });

    await nodemailer.sendMail({
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
    });

    return res.status(201).json(invitation);
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const acceptInvitation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const invitation = await prisma.invitation.findUnique({
      where: {id},
      include: { sender: true, receiver: true, group: true },
    });

    if (!invitation) {
      const error = new Error("No s'ha trobat la invitació");
      error.statusCode = 404;
      throw error;
    }

    const acceptedInvitation = await prisma.invitation.update({
      where: {id},
      data: {
        status: "accepted",
      }
    });

    res.status(200).json({
      ok: true,
      message: `${invitation.sender.name} (${invitation.sender.username}) i tu ja sou amics!`
    });
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const rejectInvitation = async (req, res, next) => {
  try {

  } catch (error) {

  }
};

module.exports = {
  getInvitations,
  sendInvitations,
  acceptInvitation,
};
