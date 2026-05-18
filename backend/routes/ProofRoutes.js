const express = require('express');
const router = express.Router();
const proofController = require('../controllers/ProofController');
const upload = require("../config/upload");


router.get('/', proofController.getProofs);
router.get('/:id', proofController.getProofById);

router.post("/", (req, res, next) => {
  if (req.is("multipart/form-data")) {
    upload.single("proofImage")(req, res, next);
  } else {
    next();
  }
}, proofController.createProof);

router.put('/:id', proofController.updateProof);
router.delete('/:id', proofController.deleteProof);


module.exports = router;
