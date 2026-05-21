const express = require('express');
const router = express.Router();
const groupUserController = require('../controllers/GroupUserController');
const { isAuthenticated } = require('../middlewares/auth/authorize');

router.get('/', groupUserController.getGroupUsers);
router.get('/:group_id/:user_id', groupUserController.getGroupUser);
router.post('/', isAuthenticated, groupUserController.createGroupUser);
router.put('/:group_id/:user_id', isAuthenticated, groupUserController.updateGroupUser);
router.delete('/:group_id/:user_id', isAuthenticated, groupUserController.deleteGroupUser);

module.exports = router;