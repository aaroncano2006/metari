const express = require('express');
const router = express.Router();
const metaController = require('../controllers/MetaController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', metaController.getMetas);
router.get('/user/:userId', metaController.getMetasByUserId);
router.get('/:id', metaController.getMetaById);
router.post('/', isAuthenticated, metaController.createMeta);
router.put('/:id', isAuthenticated, isAdmin, metaController.updateMeta);
router.delete('/:id', isAuthenticated, isAdmin, metaController.deleteMeta);

module.exports = router;
