const express = require('express');
const router = express.Router();
const multer = require('multer');
const sliderController = require('../controllers/sliderController');
const { requireAuth } = require('../middleware/authMiddleware');

// Configure Multer with in-memory storage for safe inspection & direct cloud streaming
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

// Wrapper middleware to catch Multer errors (e.g., file size limit) gracefully
function handleUpload(fieldName) {
  const single = upload.single(fieldName);
  return (req, res, next) => {
    single(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image size exceeds maximum limit of 5MB. Please choose a smaller image.'
          });
        }
        return res.status(400).json({
          success: false,
          message: 'Upload error: ' + err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
}

// ==========================================
// PUBLIC ROUTES
// ==========================================
// GET /api/slides (Active slides for public homepage)
router.get('/slides', sliderController.getActiveSlides);

// ==========================================
// ADMIN ONLY ROUTES (JWT Protected)
// ==========================================
// GET /api/admin/slides (All slides for admin console)
router.get('/admin/slides', requireAuth, sliderController.getAllSlides);

// GET /api/admin/slides/storage-status (Cloud / volume storage configuration)
router.get('/admin/slides/storage-status', requireAuth, sliderController.getStorageStatus);

// GET /api/admin/slides/:id
router.get('/admin/slides/:id', requireAuth, sliderController.getSlideById);

// POST /api/admin/slides (Create slide with image upload)
router.post('/admin/slides', requireAuth, handleUpload('image'), sliderController.createSlide);

// PUT /api/admin/slides/reorder (Bulk reorder slides)
router.put('/admin/slides/reorder', requireAuth, sliderController.reorderSlides);

// PUT /api/admin/slides/:id (Update slide text / replace image)
router.put('/admin/slides/:id', requireAuth, handleUpload('image'), sliderController.updateSlide);

// PATCH /api/admin/slides/:id/toggle (Enable / disable slide)
router.patch('/admin/slides/:id/toggle', requireAuth, sliderController.toggleSlideActive);

// DELETE /api/admin/slides/:id (Delete slide and purge image)
router.delete('/admin/slides/:id', requireAuth, sliderController.deleteSlide);

module.exports = router;
