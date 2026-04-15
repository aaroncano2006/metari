const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Definimos el GET de todas las categorías

//get tots els usuaris
router.get('/', userController.getUsuaris);
router.get('/:id', userController.getUsuariById);
router.post('/', userController.createUsuari);
router.delete('/:id', userController.deleteUsuari);
router.put('/:id', userController.updateUsuari);


module.exports = router;

// console.log(" USER ROUTES LOADED"); // si mostra per conmsola