const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/InvitationController');
const { isAuthenticated } = require('../middlewares/auth/authorize');

router.get('/:userid/:sentorreceived/:status', isAuthenticated, invitationController.getInvitations);
router.post('/:senderid/:receiverid', isAuthenticated, invitationController.sendInvitations);
router.post('/:senderid/:receiverid/:groupid', isAuthenticated, invitationController.sendInvitations);
router.put('/:receiverid/:id', isAuthenticated, invitationController.acceptInvitation);
router.delete('/:id', isAuthenticated, invitationController.rejectInvitation);

router.get('/friends/:userid', isAuthenticated, invitationController.getFriendsByID);

module.exports = router;