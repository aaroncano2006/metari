const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ ok: false, error: "Token no proporcionat" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, error: "Token invàlid o expirat" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ ok: false, error: "Accés denegat: cal ser administrador" });
  }
  next();
};

const tryAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      req.user = jwt.verify(token, SECRET);
    } catch (_) {}
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  tryAuth,
};
