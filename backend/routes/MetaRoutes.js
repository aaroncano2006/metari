const express = require('express');
const router = express.Router();
const metaController = require('../controllers/MetaController');
const { isAuthenticated, tryAuth } = require('../middlewares/auth/authorize');

// Amb el middleware tryAuth (ubicat a authorize.js), a diferència de isAuthenticated
// no rebutja la petició si no hi ha token, però ens serveix per mostrar només les metes
// públiques en cas de no estar autenticats.

router.get('/', tryAuth, metaController.getMetas);
router.get('/user/:userId', tryAuth, metaController.getMetasByUserId);
router.get('/:id', tryAuth, metaController.getMetaById);
router.post('/', isAuthenticated, metaController.createMeta);
router.put('/:id', isAuthenticated, metaController.updateMeta);
router.delete('/:id', isAuthenticated, metaController.deleteMeta);

module.exports = router;
