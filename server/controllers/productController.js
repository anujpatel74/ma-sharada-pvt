const db = require('../../database/database');

// GET /api/products (with optional query filters: search, brand, category, availability)
exports.getAllProducts = (req, res) => {
  const { search, brand, category, availability } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (brand && brand !== 'ALL') {
    sql += ' AND UPPER(brand) = ?';
    params.push(brand.toUpperCase());
  }

  if (category && category !== 'ALL') {
    sql += ' AND UPPER(category) = ?';
    params.push(category.toUpperCase());
  }

  if (availability && availability !== 'ALL') {
    sql += ' AND availability = ?';
    params.push(availability);
  }

  if (search && search.trim() !== '') {
    sql += ' AND (name LIKE ? OR brand LIKE ? OR category LIKE ? OR description LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }

  sql += ' ORDER BY is_featured DESC, id ASC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
    }
    res.json({ success: true, count: rows.length, data: rows });
  });
};

// GET /api/products/:id
exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, data: row });
  });
};

// POST /api/products (Admin only)
exports.createProduct = (req, res) => {
  const { name, brand, category, description, image, price, availability, is_featured } = req.body;

  if (!name || !brand || !category) {
    return res.status(400).json({ success: false, message: 'Name, brand, and category are required.' });
  }

  const finalPrice = price && price.trim() !== '' ? price.trim() : 'Price available on enquiry';
  const finalAvail = availability || 'In Stock';
  const finalFeatured = is_featured ? 1 : 0;
  const finalImage = image || '/images/products/amaron_car_battery.jpg';

  const sql = `INSERT INTO products (name, brand, category, description, image, price, availability, is_featured)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [name.trim(), brand.trim(), category.trim(), description || '', finalImage, finalPrice, finalAvail, finalFeatured], function(err) {
    if (err) {
      console.error('Error adding product:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to create product.' });
    }
    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { id: this.lastID, name, brand, category, price: finalPrice, availability: finalAvail }
    });
  });
};

// PUT /api/products/:id (Admin only)
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, brand, category, description, image, price, availability, is_featured } = req.body;

  if (!name || !brand || !category) {
    return res.status(400).json({ success: false, message: 'Name, brand, and category are required.' });
  }

  const finalPrice = price && price.trim() !== '' ? price.trim() : 'Price available on enquiry';
  const finalAvail = availability || 'In Stock';
  const finalFeatured = is_featured ? 1 : 0;

  let sql = `UPDATE products SET name = ?, brand = ?, category = ?, description = ?, price = ?, availability = ?, is_featured = ?`;
  const params = [name.trim(), brand.trim(), category.trim(), description || '', finalPrice, finalAvail, finalFeatured];

  if (image) {
    sql += `, image = ?`;
    params.push(image);
  }

  sql += ` WHERE id = ?`;
  params.push(id);

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating product:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to update product.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product updated successfully.' });
  });
};

// DELETE /api/products/:id (Admin only)
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete product.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted successfully.' });
  });
};
