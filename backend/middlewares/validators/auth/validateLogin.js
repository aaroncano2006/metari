const validateLogin = async (data) => {
  if (!data.email_or_username) {
    return "El nom d'usuari o email és obligatori!";
  }

  if (typeof data.email_or_username !== "string") {
    return "El valor introduït no és vàlid!";
  }

  if (data.email_or_username.trim() === "") {
    return "El nom d'usuari o email està buit!";
  }

  if (data.email_or_username.includes("@")) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,}$/.test(data.email_or_username)) {
      return "El format de l'email no és vàlid!";
    }
  } else {
    if (!/[a-zA-Z0-9]+$/.test(data.email_or_username)) {
      return "El nom d'usuari només pot contenir lletres i números!";
    }

    if (data.email_or_username.length < 5) {
      return "El nom d'usuari ha de contenir almenys 5 caràcters!";
    }

    if (data.email_or_username.length > 20) {
      return "El nom d'usuari ha de contenir menys de 20 caràcters!";
    }
  }

  if (!data.password) {
    return "La contrasenya és obligatòria!";
  }

  if (typeof data.password !== "string") {
    return "La contrasenya introduïda no és vàlida! Ha de ser un text!";
  }

  if (data.password.trim() === "") {
    return "La contrasenya està buida!";
  }

  if (data.password.length < 8) {
    return "La contrasenya ha de contenir almenys 8 caràcters!";
  }

  return null;
};

module.exports = { validateLogin };
