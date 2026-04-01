const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { postComment, getApprovedComments, getNotApprovedComments } = require('../controllers/comments.controller');

const router = Router();

router.post('/comment', postComment);
router.get('/comments', getApprovedComments);
router.get('/comments/not-approved', authMiddleware, getNotApprovedComments);

module.exports = router;
