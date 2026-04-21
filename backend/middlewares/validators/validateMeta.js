const prisma = require("../../config/prisma");

const validateMeta = async (data) => {
    if (!data.title) {
        return "El títol de la meta és obligatori";
    }

    if (typeof data.title !== "string") {
        return "El títol enviat no és vàlid! Ha de ser un text.";
    }

    if (data.title.trim() === "") {
        return "El títol enviat està buit.";
    }

    if (data.title.length < 5) {
        return "El títol de la meta ha de tenir com a mínim 5 caràcters!";
    }

    if (data.description && typeof data.description !== "string") {
        return "La descripció enviada no és vàlida! Ha de ser un text.";
    }

    if (!data.author_id) {
        return "La id de l'autor de la meta és obligatoria!";
    }

    if (isNaN(data.author_id)) {
        return "La id de l'autor de la meta no és vàlida";
    }

    const existingAuthor = await prisma.user.findUnique({
        where: {id: parseInt(data.author_id)}
    });

    if (!existingAuthor) {
        return "La id de l'autor enviada no correspon a cap usuari registrat!";
    }

    if (!data.group_id) {
        return "La id del grup de la meta és obligatoria!";
    }

    if (isNaN(data.group_id)) {
        return "La id del grup de la meta no és vàlida";
    }

    const existingGroup = await prisma.group.findUnique({
        where: {id: parseInt(data.group_id)}
    })

    if (!existingGroup) {
        return "La id del grup enviada no correspon a cap grup registrat en el sistema."
    }

    if (!data.type) {
        return "El tipus de la meta és obligatori!";
    }

    if (data.type && data.type !== "task" && data.type !== "challenge") {
        return "El tipus de meta no és vàlid!";
    }

    return null;
};

module.exports = {
  validateMeta,
};
