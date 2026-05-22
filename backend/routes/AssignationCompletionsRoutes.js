const express = require('express');

const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth/authorize');

const assignationCompletionsController = require('../controllers/AssignationCompletionsController');
router.post('/', isAuthenticated, assignationCompletionsController.createAssignationCompletion);
module.exports = router;