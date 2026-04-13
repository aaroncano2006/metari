const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

// Definimos el GET de todas las categorías
router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.post('/', categoryController.createCategory);

module.exports = router;