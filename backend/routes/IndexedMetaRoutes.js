const express = require('express');
const router = express.Router();
const indexedMetaController = require('../controllers/IndexedMetaController');

router.get('/', indexedMetaController.getIndexedMetas);
router.get('/:id', indexedMetaController.getIndexedMetaById);
router.post('/', indexedMetaController.createIndexedMeta);
router.put('/:id', indexedMetaController.updateIndexedMeta);
router.delete('/:id', indexedMetaController.deleteIndexedMeta);

module.exports = router;