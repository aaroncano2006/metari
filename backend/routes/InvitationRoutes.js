const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/InvitationController');

router.get('/:userid/:status', invitationController.getInvitations);
router.post('/:senderid/:receiverid', invitationController.sendInvitations);
router.post('/:senderid/:receiverid/:groupid', invitationController.sendInvitations);
router.put('/:id', invitationController.acceptInvitation);

module.exports = router;