const express = require('express');
const router = express.Router();
const proofController = require('../controllers/ProofController');
const upload = require("../config/upload");
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', isAuthenticated, proofController.getProofs);
router.get('/:id', isAuthenticated, proofController.getProofById);

router.post("/", isAuthenticated, (req, res, next) => {
  if (req.is("multipart/form-data")) {
    upload.single("proofImage")(req, res, next);
  } else {
    next();
  }
}, proofController.createProof);

router.put("/:id", isAuthenticated, (req, res, next) => {
    if (req.is("multipart/form-data")) {
        upload.single("proofImage")(req, res, next);
    } else {
        next();
    }
}, proofController.updateProof);

router.delete('/:id', isAuthenticated, isAdmin, proofController.deleteProof);

/*const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', proofController.getProofs);
router.get('/:id', proofController.getProofById);
router.post('/', isAuthenticated, proofController.createProof);
router.put('/:id', isAuthenticated, proofController.updateProof);
router.delete('/:id', isAuthenticated, isAdmin, proofController.deleteProof);*/


module.exports = router;
