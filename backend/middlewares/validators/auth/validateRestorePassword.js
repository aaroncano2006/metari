const validateRestorePassword = async (data) => {
  if (!data.token) {
    return "El token és obligatori!";
  }

  if (typeof data.token !== "string") {
    return "El token introduït no és vàlid!";
  }

  if (data.token.trim() === "") {
    return "El token està buit!";
  }

  if (!data.new_password) {
    return "La contrasenya és obligatòria!";
  }

  if (typeof data.new_password !== "string") {
    return "La contrasenya introduïda no és vàlida! Ha de ser un text!";
  }

  if (data.new_password.trim() === "") {
    return "La contrasenya està buida!";
  }

  if (data.new_password.length < 8) {
    return "La contrasenya ha de contenir almenys 8 caràcters!";
  }

  if (!data.confirm_password) {
    return "La confirmació de la contrasenya és obligatòria!";
  }

  if (typeof data.confirm_password !== "string") {
    return "La confirmació introduïda no és vàlida! Ha de ser un text!";
  }

  if (data.confirm_password.trim() === "") {
    return "La confirmació de la contrasenya està buida!";
  }

  if (data.confirm_password.length < 8) {
    return "La confirmació de la contrasenya ha de contenir almenys 8 caràcters!";
  }

  if (data.new_password !== data.confirm_password) {
    return "Les contrasenyes no coincideixen!";
  }

  return null;
};

module.exports = { validateRestorePassword };
