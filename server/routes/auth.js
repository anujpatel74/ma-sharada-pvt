const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/login', authController.adminLogin);
router.get('/me', requireAuth, authController.getAdminProfile);

module.exports = router;
