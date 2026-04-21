const express = require('express');
const router = express.Router();
const proofController = require('../controllers/ProofController');

router.get('/', proofController.getProofs);
router.get('/:id', proofController.getProofById);
router.post('/', proofController.createProof);
router.put('/:id', proofController.updateProof);
router.delete('/:id', proofController.deleteProof);

module.exports = router;
