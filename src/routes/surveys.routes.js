const express        = require('express');
const controller     = require('../controllers/surveys.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/questions',  controller.getActiveQuestions);
router.post('/respond',   controller.submitResponse);

router.get('/admin/questions',      verifyToken, controller.getAllQuestions);
router.put('/admin/questions/:id',  verifyToken, controller.updateQuestion);
router.get('/admin/responses',      verifyToken, controller.getAllResponses);

module.exports = router;
