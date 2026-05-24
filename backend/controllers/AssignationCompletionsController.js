const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const createAssignationCompletion = async (req, res, next) => {
  try {
    const { assignation_id, user_id, is_Completed } = req.body;

    const targetUserId = parseInt(user_id);

    const assignationId = parseInt(assignation_id);
    if (isNaN(assignationId)) {
      const error = new Error("ID d'assignació invàlida");
      error.statusCode = 400;
      throw error;
    }

    const assignation = await prisma.assignation.findUnique({
      where: { id: assignationId },
      include: {
        meta: true,
        group: {
          include: {
            groupUsers: { where: { user_id: req.user.id } },
          },
        },
      },
    });

    if (!assignation) {
      const error = new Error("Assignació no trobada");
      error.statusCode = 404;
      throw error;
    }

    const isAssignee = assignation.user_id === req.user.id;
    const isGroupOwner = assignation.group?.owner_id === req.user.id;
    const isGroupModerator = assignation.group?.groupUsers?.some(
      (gu) => gu.role === "moderator",
    ) ?? false;
    const isGroupMember = (assignation.group?.groupUsers?.length ?? 0) > 0;
    const isChallenge = assignation.meta?.type === "challenge";

    if (!isAssignee && !isGroupOwner && !isGroupModerator && !(isChallenge && isGroupMember) && req.user.role !== "admin") {
      const error = new Error("No tens permisos per completar aquesta assignació");
      error.statusCode = 403;
      throw error;
    }

    const completion = await prisma.assignationCompletions.create({
      data: {
        assignation_id: assignationId,
        user_id: targetUserId,
        is_Completed: is_Completed ?? true,
      },
      include: { user: true },
    });

    if (!assignation.completed) {
      await prisma.assignation.update({
        where: { id: assignationId },
        data: { completed: true },
      });

      const user = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (user) {
        const assignationScore = assignation.score ?? BigInt(0);
        if (assignation.meta?.type === "challenge") {
          if (assignationScore > BigInt(0)) {
            await prisma.user.update({
              where: { id: targetUserId },
              data: { score: (user.score ?? BigInt(0)) + assignationScore },
            });
          }
        } else {
          const updateData = {
            completed_tasks: (user.completed_tasks ?? BigInt(0)) + BigInt(1),
          };
          if (assignationScore > BigInt(0)) {
            updateData.score = (user.score ?? BigInt(0)) + assignationScore;
          }
          await prisma.user.update({
            where: { id: targetUserId },
            data: updateData,
          });
        }
      }
    }

    res.status(201).json(utils.handleBigInt(completion));
  } catch (error) {
    console.error("Error creant AssignationCompletion:", error);
    next(error);
  }
};
module.exports = {
  createAssignationCompletion,
};