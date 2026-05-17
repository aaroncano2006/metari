const express = require('express');
const router = express.Router();
const proofController = require('../controllers/ProofController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', proofController.getProofs);
router.get('/:id', proofController.getProofById);
router.post('/', isAuthenticated, proofController.createProof);
router.put('/:id', isAuthenticated, proofController.updateProof);
router.delete('/:id', isAuthenticated, isAdmin, proofController.deleteProof);

module.exports = router;
