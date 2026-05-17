const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');


router.get('/', groupController.getGroups);
router.get('/user/:userId', isAuthenticated, groupController.getGroupsByUserId);
router.get('/:id', groupController.getGroupById);
router.post('/', groupController.createGroup);
router.put('/:id', isAuthenticated, isAdmin, groupController.updateGroup);
router.delete('/:id', isAuthenticated, isAdmin, groupController.deleteGroup);


module.exports = router;
