const express = require('express');
const router = express.Router();
const metaController = require('../controllers/MetaController');

// Definimos el GET de todas las categorías

//get tots els usuaris
router.get('/', metaController.getMetas);
// router.get('/:id', metaController.getUsuariById);
router.post('/', metaController.createMeta);
// router.delete('/:id', metaController.deleteUsuari);
// router.put('/:id', metaController.updateUsuari);


module.exports = router;

// console.log(" USER ROUTES LOADED"); // si mostra per conmsola