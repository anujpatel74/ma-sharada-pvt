const db = require('../../database/database');

// POST /api/enquiries (Public customer order booking & enquiry)
exports.createEnquiry = (req, res) => {
  const { customer_name, mobile, email, address, product_id, product_name, quantity, message } = req.body;

  const sql = `INSERT INTO enquiries (customer_name, mobile, email, address, product_id, product_name, quantity, message, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'NEW')`;

  db.run(
    sql,
    [customer_name, mobile, email || null, address || null, product_id || null, product_name, quantity || 1, message || null],
    function(err) {
      if (err) {
        console.error('Error inserting customer booking:', err.message);
        return res.status(500).json({ success: false, message: 'Database error saving your order booking.' });
      }

      console.log(`[Customer Booking Saved in SQLite] ID: ${this.lastID}, Customer: ${customer_name}, Mobile: ${mobile}, Product: ${product_name}, Qty: ${quantity || 1}`);

      res.status(201).json({
        success: true,
        enquiryId: this.lastID,
        message: 'Thank you! Your booking/order has been recorded successfully. MAA SHARADA ENTERPRISES will contact you soon.'
      });
    }
  );
};

// GET /api/enquiries (Admin only)
exports.getAllEnquiries = (req, res) => {
  const { status, search } = req.query;
  let sql = 'SELECT * FROM enquiries WHERE 1=1';
  const params = [];

  if (status && status !== 'ALL') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim() !== '') {
    sql += ' AND (customer_name LIKE ? OR mobile LIKE ? OR product_name LIKE ? OR address LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }

  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error retrieving enquiries:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to retrieve enquiries.' });
    }
    res.json({ success: true, count: rows.length, data: rows });
  });
};

// PUT /api/enquiries/:id (Admin only - update status)
exports.updateEnquiryStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['NEW', 'CONTACTED', 'COMPLETED'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status. Allowed: NEW, CONTACTED, COMPLETED.' });
  }

  db.run('UPDATE enquiries SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to update enquiry status.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    res.json({ success: true, message: `Enquiry status changed to ${status}.` });
  });
};

// DELETE /api/enquiries/:id (Admin only)
exports.deleteEnquiry = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM enquiries WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting enquiry by admin:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to delete customer record.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Customer record not found.' });
    }
    console.log(`[Admin Action] Deleted customer booking record ID: ${id}`);
    res.json({ success: true, message: 'Customer booking record deleted successfully by Admin.' });
  });
};
