const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');
const { isAuthenticated } = require('../middlewares/auth/authorize');


router.get('/', isAuthenticated, groupController.getGroups);
router.get('/user/:userId', isAuthenticated, groupController.getGroupsByUserId);
router.get('/:id', isAuthenticated, groupController.getGroupById);
router.post('/', isAuthenticated, groupController.createGroup);
router.put('/:id', isAuthenticated, groupController.updateGroup);
router.delete('/:id', isAuthenticated, groupController.deleteGroup);


module.exports = router;
