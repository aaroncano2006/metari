const express = require('express');
const router = express.Router();
const metaController = require('../controllers/MetaController');
// const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', metaController.getMetas);
router.get('/user/:userId', metaController.getMetasByUserId);
router.get('/:id', metaController.getMetaById);
router.post('/', metaController.createMeta);
router.put('/:id', metaController.updateMeta);
router.delete('/:id', metaController.deleteMeta);

module.exports = router;
