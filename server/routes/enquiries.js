const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateEnquiry } = require('../middleware/validationMiddleware');

// Public customer submission with strict validation
router.post('/', validateEnquiry, enquiryController.createEnquiry);

// Admin protected routes
router.get('/', requireAuth, enquiryController.getAllEnquiries);
router.put('/:id', requireAuth, enquiryController.updateEnquiryStatus);
router.delete('/:id', requireAuth, enquiryController.deleteEnquiry);

module.exports = router;
