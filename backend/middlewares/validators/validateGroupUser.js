const prisma = require("../../config/prisma");

const validateGroupUser = async (data) => {
    const existingGroup = await prisma.group.findUnique({
        where: {id: data.group_id}
    });

    if (!existingGroup) {
        return "La id del grup no correspon a cap grup registrat al sistema!";
    }

    const existingUser = await prisma.user.findUnique({
        where: {id: data.user_id}
    });

    if (!existingUser) {
        return "La id de l'usuari no correspon a cap usuari registrat al sistema!";
    }

    const validRoles = ["member", "moderator"];

    if (data.role && !validRoles.includes(data.role)) {
        return "El rol especificat no és vàlid!";
    }

    return null;
};

module.exports = {
    validateGroupUser
};