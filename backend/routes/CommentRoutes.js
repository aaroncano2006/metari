const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const { isAuthenticated } = require('../middlewares/auth/authorize');

router.get('/', isAuthenticated, commentController.getComments);
router.get('/:id', isAuthenticated, commentController.getCommentById);
router.post('/', isAuthenticated, commentController.createComment);
router.put('/:id', isAuthenticated, commentController.updateComment);
router.delete('/:id', isAuthenticated, commentController.deleteComment);

module.exports = router;
