const { Router } = require('express');
const controller = require('../controllers/comments.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

// - PUBLIC --------------------------------------------------------------------
router.get('/', controller.getApprovedComments);
router.post('/', controller.postComment);

// - ADMIN ---------------------------------------------------------------------
router.get('/admin',        verifyToken, controller.getAllComments);
router.put('/admin/:id',    verifyToken, controller.toggleComment);
router.get('/admin/not-approved', verifyToken, controller.getNotApprovedComments);

module.exports = router;
