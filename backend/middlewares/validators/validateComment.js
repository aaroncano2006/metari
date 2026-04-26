const prisma = require("../../config/prisma");

const validateComment = async (data, isUpdating = false) => {
    if (data.assignation_id && !isUpdating) {
        const existingAssignation = await prisma.assignation.findFirst({
          where: {id: data.assignation_id}  
        });

        if (!existingAssignation) {
            return "La id de l'assignació no correspon a cap assignació registrada en el sistema!";
        }
    }

    if (data.user_id && !isUpdating) {
        const existingUser = await prisma.user.findFirst({
            where: {id: data.user_id}
        });

        if (!existingUser) {
            return "La id de l'usuari no correspon a cap usuari registrat en el sistema!";
        }
    }

    if (!data.body && !isUpdating) {
        return "El cos del comentari és obligatori!";
    }

    if (typeof(data.body) !== "string") {
        return "El cos del comentari ha de ser un text!";
    }

    if (data.body.trim() === "") {
        return "El cos del comentari no pot estar buit!";
    }

    return null;
};

module.exports = {
    validateComment
};