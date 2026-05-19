const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const createAssignationCompletion = async (req, res, next) => {
  try {
    const { assignation_id, user_id, is_Completed } = req.body;
    const completion = await prisma.assignationCompletions.create({
      data: {
        assignation_id: parseInt(assignation_id),
        user_id: parseInt(user_id),
        is_Completed: is_Completed ?? true,
      },
      include: { user: true },
    });
    
    res.status(201).json(utils.handleBigInt(completion));
  } catch (error) {
    console.error("Error creant AssignationCompletion:", error);
    next(error);
  }
};
module.exports = {
  createAssignationCompletion,
};