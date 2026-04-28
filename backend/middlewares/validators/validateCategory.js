const validateCategory = async (data) => {

    if (!data.name) {
        return "El nom de la categoria és obligatori!";
    }

    if (typeof(data.name) !== "string") {
        return "El nom enviat no és vàlid! Ha de ser un text";
    }

    if (data.name.trim() === "") {
        return "El nom enviat està buit.";
    }

    if (data.description && typeof(data.description) !== "string") {
        return "La descripció enviada no és vàlida! Ha de ser un text";
    }

    return null;
};

module.exports = {
    validateCategory
};