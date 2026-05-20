const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/InvitationController');
// const { isAuthenticated } = require('../middlewares/auth/authorize');

router.get('/:userid/:sentorreceived/:status', invitationController.getInvitations);
router.post('/:senderid/:receiverid', invitationController.sendInvitations);
router.post('/:senderid/:receiverid/:groupid', invitationController.sendInvitations);
router.put('/:receiverid/:id', invitationController.acceptInvitation);
router.delete('/:id', invitationController.rejectInvitation);

router.get('/friends/:userid', invitationController.getFriendsByID);

module.exports = router;