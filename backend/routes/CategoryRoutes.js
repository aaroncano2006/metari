const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

// Definimos el GET de todas las categorías
router.get('/', categoryController.getCategories);

module.exports = router;