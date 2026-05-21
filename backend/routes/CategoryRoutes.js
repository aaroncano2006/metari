const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.post('/', isAuthenticated, isAdmin, categoryController.createCategory);

router.put('/:id', isAuthenticated, isAdmin, categoryController.updateCategory);

router.delete('/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

module.exports = router;