const db = require('../../database/database');
const storageService = require('../services/storageService');

/**
 * GET /api/slides (Public)
 * Returns all active slides ordered by display_order ASC, id ASC
 */
exports.getActiveSlides = (req, res) => {
  const sql = `SELECT * FROM slider_slides WHERE is_active = 1 ORDER BY display_order ASC, id ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching active slides:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve homepage slides.'
      });
    }
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
};

/**
 * GET /api/admin/slides (Admin Only)
 * Returns all slides (both active and inactive)
 */
exports.getAllSlides = (req, res) => {
  const sql = `SELECT * FROM slider_slides ORDER BY display_order ASC, id ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching admin slides:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve slides list.'
      });
    }
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
};

/**
 * GET /api/admin/slides/storage-status (Admin Only)
 * Returns cloud / local storage configuration status
 */
exports.getStorageStatus = (req, res) => {
  try {
    const status = storageService.getStorageStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to inspect storage status: ' + err.message
    });
  }
};

/**
 * GET /api/admin/slides/:id (Admin Only)
 */
exports.getSlideById = (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM slider_slides WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Slide not found.' });
    }
    res.json({ success: true, data: row });
  });
};

/**
 * POST /api/admin/slides (Admin Only)
 * Creates a new slide with optional file upload or image_url
 */
exports.createSlide = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      badge_text,
      badge_icon,
      badge_color,
      button_text,
      button_link,
      secondary_button_text,
      secondary_button_link,
      display_order,
      is_active,
      image_url: bodyImageUrl
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Slide title is required.'
      });
    }

    let finalImageUrl = '';
    let imagePublicId = null;
    let storageType = 'local';

    // 1. Process uploaded file if provided
    if (req.file) {
      const uploadResult = await storageService.uploadImage({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype
      });
      finalImageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
      storageType = uploadResult.storageType;
    } else if (bodyImageUrl && bodyImageUrl.trim().length > 0) {
      // Direct URL or predefined stock image
      finalImageUrl = bodyImageUrl.trim();
      storageType = finalImageUrl.startsWith('http') ? 'external' : 'local';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a slider image or provide an image URL.'
      });
    }

    // Determine display order
    let orderNum = parseInt(display_order, 10);
    if (isNaN(orderNum)) {
      // Find current max order
      const maxRow = await new Promise((resolve) => {
        db.get(`SELECT MAX(display_order) as maxOrder FROM slider_slides`, [], (err, row) => {
          resolve(row && row.maxOrder ? row.maxOrder : 0);
        });
      });
      orderNum = maxRow + 1;
    }

    const finalActive = (is_active === '0' || is_active === 0 || is_active === false) ? 0 : 1;

    const sql = `INSERT INTO slider_slides (
      title, subtitle, badge_text, badge_icon, badge_color,
      button_text, button_link, secondary_button_text, secondary_button_link,
      image_url, image_public_id, storage_type, display_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      title.trim(),
      (subtitle || '').trim(),
      (badge_text || '').trim(),
      (badge_icon || 'fas fa-bolt').trim(),
      (badge_color || 'default').trim(),
      (button_text || '').trim(),
      (button_link || '').trim(),
      (secondary_button_text || '').trim(),
      (secondary_button_link || '').trim(),
      finalImageUrl,
      imagePublicId,
      storageType,
      orderNum,
      finalActive
    ];

    db.run(sql, params, function(insertErr) {
      if (insertErr) {
        console.error('Error inserting slide:', insertErr.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to create slide: ' + insertErr.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Homepage slide created successfully.',
        data: {
          id: this.lastID,
          title: title.trim(),
          image_url: finalImageUrl,
          display_order: orderNum,
          is_active: finalActive
        }
      });
    });
  } catch (err) {
    console.error('createSlide exception:', err.message);
    res.status(400).json({
      success: false,
      message: err.message || 'Error processing slide upload.'
    });
  }
};

/**
 * PUT /api/admin/slides/:id (Admin Only)
 * Updates an existing slide, optionally replacing the image
 */
exports.updateSlide = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch current slide to check existence and previous image
    const existing = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM slider_slides WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Slide not found.' });
    }

    const {
      title,
      subtitle,
      badge_text,
      badge_icon,
      badge_color,
      button_text,
      button_link,
      secondary_button_text,
      secondary_button_link,
      display_order,
      is_active,
      image_url: bodyImageUrl
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Slide title is required.'
      });
    }

    let finalImageUrl = existing.image_url;
    let finalPublicId = existing.image_public_id;
    let finalStorageType = existing.storage_type;

    // If replacement image file uploaded
    if (req.file) {
      const uploadResult = await storageService.uploadImage({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype
      });

      // Cleanup old image if not default hero stock
      if (existing.image_url && !existing.image_url.includes('/images/hero/')) {
        await storageService.deleteImage(existing.image_url, existing.image_public_id, existing.storage_type);
      }

      finalImageUrl = uploadResult.url;
      finalPublicId = uploadResult.publicId;
      finalStorageType = uploadResult.storageType;
    } else if (bodyImageUrl && bodyImageUrl.trim().length > 0 && bodyImageUrl.trim() !== existing.image_url) {
      finalImageUrl = bodyImageUrl.trim();
      finalPublicId = null;
      finalStorageType = finalImageUrl.startsWith('http') ? 'external' : 'local';
    }

    const orderNum = !isNaN(parseInt(display_order, 10)) ? parseInt(display_order, 10) : existing.display_order;
    const finalActive = is_active !== undefined
      ? ((is_active === '0' || is_active === 0 || is_active === false) ? 0 : 1)
      : existing.is_active;

    const sql = `UPDATE slider_slides SET
      title = ?, subtitle = ?, badge_text = ?, badge_icon = ?, badge_color = ?,
      button_text = ?, button_link = ?, secondary_button_text = ?, secondary_button_link = ?,
      image_url = ?, image_public_id = ?, storage_type = ?, display_order = ?, is_active = ?,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`;

    const params = [
      title.trim(),
      (subtitle !== undefined ? subtitle : existing.subtitle || '').trim(),
      (badge_text !== undefined ? badge_text : existing.badge_text || '').trim(),
      (badge_icon !== undefined ? badge_icon : existing.badge_icon || 'fas fa-bolt').trim(),
      (badge_color !== undefined ? badge_color : existing.badge_color || 'default').trim(),
      (button_text !== undefined ? button_text : existing.button_text || '').trim(),
      (button_link !== undefined ? button_link : existing.button_link || '').trim(),
      (secondary_button_text !== undefined ? secondary_button_text : existing.secondary_button_text || '').trim(),
      (secondary_button_link !== undefined ? secondary_button_link : existing.secondary_button_link || '').trim(),
      finalImageUrl,
      finalPublicId,
      finalStorageType,
      orderNum,
      finalActive,
      id
    ];

    db.run(sql, params, function(updateErr) {
      if (updateErr) {
        console.error('Error updating slide:', updateErr.message);
        return res.status(500).json({ success: false, message: 'Failed to update slide.' });
      }

      res.json({
        success: true,
        message: 'Slide updated successfully.',
        data: {
          id: parseInt(id, 10),
          title: title.trim(),
          image_url: finalImageUrl,
          display_order: orderNum,
          is_active: finalActive
        }
      });
    });
  } catch (err) {
    console.error('updateSlide exception:', err.message);
    res.status(400).json({
      success: false,
      message: err.message || 'Error updating slide.'
    });
  }
};

/**
 * PATCH /api/admin/slides/:id/toggle (Admin Only)
 * Quick toggle of active status
 */
exports.toggleSlideActive = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  let query = '';
  let params = [];

  if (is_active !== undefined) {
    const val = (is_active === 1 || is_active === '1' || is_active === true) ? 1 : 0;
    query = `UPDATE slider_slides SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params = [val, id];
  } else {
    // Invert existing
    query = `UPDATE slider_slides SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params = [id];
  }

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error toggling slide status:', err.message);
      return res.status(500).json({ success: false, message: 'Database error toggling slide status.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Slide not found.' });
    }

    db.get(`SELECT id, is_active FROM slider_slides WHERE id = ?`, [id], (getErr, row) => {
      res.json({
        success: true,
        message: `Slide ${row && row.is_active ? 'enabled' : 'disabled'} successfully.`,
        data: row
      });
    });
  });
};

/**
 * PUT /api/admin/slides/reorder (Admin Only)
 * Bulk reorders slides
 * Expects { order: [ { id: 1, display_order: 1 }, ... ] } or [ id1, id2, ... ]
 */
exports.reorderSlides = (req, res) => {
  const { order } = req.body;

  if (!order || !Array.isArray(order) || order.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order payload. Array of slide IDs or order objects required.'
    });
  }

  db.serialize(() => {
    const stmt = db.prepare(`UPDATE slider_slides SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);

    order.forEach((item, index) => {
      if (typeof item === 'object' && item !== null && item.id !== undefined) {
        const orderVal = item.display_order !== undefined ? parseInt(item.display_order, 10) : index + 1;
        stmt.run(orderVal, item.id);
      } else {
        // Just an ID
        stmt.run(index + 1, item);
      }
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error reordering slides:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to update slide order.' });
      }

      res.json({
        success: true,
        message: 'Slide order updated successfully.'
      });
    });
  });
};

/**
 * DELETE /api/admin/slides/:id (Admin Only)
 * Deletes slide and purges image file from storage if safe
 */
exports.deleteSlide = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM slider_slides WHERE id = ?`, [id], async (err, slide) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found.' });
    }

    db.run(`DELETE FROM slider_slides WHERE id = ?`, [id], async function(delErr) {
      if (delErr) {
        console.error('Error deleting slide:', delErr.message);
        return res.status(500).json({ success: false, message: 'Failed to delete slide from database.' });
      }

      // Purge image from storage (Cloudinary or local uploads)
      try {
        await storageService.deleteImage(slide.image_url, slide.image_public_id, slide.storage_type);
      } catch (storageErr) {
        console.warn('Storage cleanup notice:', storageErr.message);
      }

      res.json({
        success: true,
        message: 'Slide deleted successfully.'
      });
    });
  });
};
