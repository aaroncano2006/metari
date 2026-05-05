const express = require("express");
const router = express.Router();
const { login } = require("../../controllers/auth/LoginController");

router.post("/", login);

module.exports = router;
