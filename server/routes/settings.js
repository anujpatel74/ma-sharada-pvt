const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/settings', settingsController.getSettings);
router.put('/settings', requireAuth, settingsController.updateSettings);
router.get('/services', settingsController.getServices);
router.get('/dashboard/stats', requireAuth, settingsController.getDashboardStats);

module.exports = router;
