const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', isAuthenticated, userController.getUsuaris);
router.get('/:id', isAuthenticated, userController.getUsuariById);
router.post('/', userController.createUsuari); // Ruta pública per registrar-se.
router.put('/:id', isAuthenticated, userController.updateUsuari);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUsuari);

module.exports = router;