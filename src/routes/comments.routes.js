const { Router } = require('express');
const controller = require('../controllers/comments.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/comment', controller.postComment);
router.get('/comments', controller.getApprovedComments);
router.get('/comments/not-approved', verifyToken, controller.getNotApprovedComments);

module.exports = router;
