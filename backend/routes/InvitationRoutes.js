const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/InvitationController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/:userid/:sentorreceived/:status', isAuthenticated, invitationController.getInvitations); // segon param "sent" o "received"
router.post('/:senderid/:receiverid', isAuthenticated, invitationController.sendInvitations);
router.post('/:senderid/:receiverid/:groupid', isAuthenticated, invitationController.sendInvitations);
router.put('/:receiverid/:id', isAuthenticated, invitationController.acceptInvitation); // id: id de la invitació
router.delete('/:userid/:id', isAuthenticated, invitationController.rejectInvitation);

router.get('/friends/:userid', isAuthenticated, invitationController.getFriendsByID);

// userid pot ser tant la id de l'emissor com la del
// receptor

// Les rutes hauran de ser refactoritzades quan s'implementi el login amb JWT.

module.exports = router;