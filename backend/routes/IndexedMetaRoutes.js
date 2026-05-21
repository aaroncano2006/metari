const express = require('express');
const router = express.Router();
const indexedMetaController = require('../controllers/IndexedMetaController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', indexedMetaController.getIndexedMetas);
router.get('/:id', indexedMetaController.getIndexedMetaById);
router.post('/', isAuthenticated, indexedMetaController.createIndexedMeta);
router.put('/:id', isAuthenticated, indexedMetaController.updateIndexedMeta);
router.delete('/:id', isAuthenticated, indexedMetaController.deleteIndexedMeta);

module.exports = router;