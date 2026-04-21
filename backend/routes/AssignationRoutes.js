const express = require('express');
const router = express.Router();
const assignationController = require('../controllers/AssignationController');

// get totes les assignacions
router.get('/', assignationController.getAssignations);
router.get('/:id', assignationController.getAssignationById);
router.post('/', assignationController.createAssignation);
router.delete('/:id', assignationController.deleteAssignation);
router.put('/:id', assignationController.updateAssignation);

module.exports = router;

// console.log("ASSIGNATION ROUTES LOADED");