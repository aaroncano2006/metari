const express = require("express");
const { forgotPassword, restorePassword } = require("../../controllers/auth/RestorePasswordController");
const router = express.Router();

router.post("/forgot", forgotPassword);
router.post("/restore", restorePassword);

module.exports = router;