const express = require('express');

const router = express.Router();

const assignationCompletionsController = require('../controllers/AssignationCompletionsController');
router.post('/', assignationCompletionsController.createAssignationCompletion);
module.exports = router;