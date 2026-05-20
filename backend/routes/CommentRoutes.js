const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth/authorize');

router.get('/', commentController.getComments);
router.get('/:id', commentController.getCommentById);
router.post('/', isAuthenticated, commentController.createComment);
router.put('/:id', isAuthenticated, commentController.updateComment);
router.delete('/:id', isAuthenticated, commentController.deleteComment);

module.exports = router;
