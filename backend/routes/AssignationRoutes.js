const express = require('express');
const router = express.Router();
const assignationController = require('../controllers/AssignationController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

// get totes les assignacions
router.get('/', assignationController.getAssignations);
router.get('/:id', assignationController.getAssignationById);
router.post('/', isAuthenticated, assignationController.createAssignation);
router.delete('/:id', isAuthenticated, isAdmin, assignationController.deleteAssignation);
router.put('/:id', isAuthenticated, isAdmin, assignationController.updateAssignation);

module.exports = router;

// console.log("ASSIGNATION ROUTES LOADED");