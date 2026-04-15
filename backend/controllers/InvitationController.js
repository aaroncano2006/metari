const prisma = require("../config/prisma");
const nodemailer = require("../config/nodemailer");

const getInvitations = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userid);
    const status = req.params.status;

    const invitations = await prisma.invitation.findMany({
      where: { receiver_id: userId, status: status },
      include: { sender: true, receiver: true, group: true },
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

// const getPendingInvitations = async (req, res, next) => {

// };

// const getSentInvitations = async (req, res, next) => {

// };

// const getAcceptedInvitations = async (req, res, next) => {

// };

const sendInvitations = async (req, res, next) => {
  try {
    const senderId = parseInt(req.params.senderid);
    const recieverId = parseInt(req.params.receiverid);
    const groupId = req.params.groupid ? parseInt(req.params.groupid) : null;

    const sender = await prisma.user.findUnique({
        where: {id: senderId}
    });

    const receiver = await prisma.user.findUnique({
        where: {id: recieverId}
    });

    const group = await prisma.group.findUnique({
        where: {id: groupId}
    });

    const invitation = await prisma.invitation.create({
        data: {
            sender_id: senderId,
            receiver_id: recieverId,
            group_id: groupId,
        }
    });

    const message = await nodemailer.sendMail({
        from: 'Metari',
        to: receiver.email,
        subect: !group ? `${sender.name} (${sender.username}) t'ha enviat sol·licitud d'amistat` : `${sender.name} (${sender.username}) t'ha enviat sol·licitud per unir-te al següent grup: ${group.name}`,
    });

  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

// const acceptInvitation = async (req, res, next) => {

// };

// const rejectInvitation = async (req, res, next) => {

// };

module.exports = {
  getInvitations,
  sendInvitations,
};
