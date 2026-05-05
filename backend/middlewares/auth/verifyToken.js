const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(403);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken
};