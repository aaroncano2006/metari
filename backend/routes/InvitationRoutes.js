const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/InvitationController');

router.get('/:userid/:status', invitationController.getInvitations);
router.post('/:senderid/:receiverid', invitationController.sendInvitations);
router.post('/:senderid/:receiverid/:groupid', invitationController.sendInvitations);
router.put('/:receiverid/:id', invitationController.acceptInvitation);
router.delete('/:userid/:id', invitationController.rejectInvitation);

// userid pot ser tant la id de l'emissor com la del
// receptor

module.exports = router;