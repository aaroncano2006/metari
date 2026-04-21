const express = require('express');
const router = express.Router();
const groupUserController = require('../controllers/GroupUserController');

router.get('/', groupUserController.getGroupUsers);
router.get('/:group_id/:user_id', groupUserController.getGroupUser);
router.post('/', groupUserController.createGroupUser);
router.put('/:group_id/:user_id', groupUserController.updateGroupUser);
router.delete('/:group_id/:user_id', groupUserController.deleteGroupUser);

module.exports = router;