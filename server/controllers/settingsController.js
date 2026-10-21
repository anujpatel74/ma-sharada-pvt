const db = require('../../database/database');

// GET /api/settings (Public - returns configured shop parameters)
exports.getSettings = (req, res) => {
  db.all('SELECT key, value FROM settings', (err, rows) => {
    if (err) {
      console.error('Error fetching settings:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to load shop settings.' });
    }
    const settingsObj = {};
    rows.forEach(r => {
      settingsObj[r.key] = r.value || '';
    });

    // Fallbacks if not set
    if (!settingsObj.SHOP_NAME) settingsObj.SHOP_NAME = 'MAA SHARADA ENTERPRISES';
    if (!settingsObj.SHOP_OWNER) settingsObj.SHOP_OWNER = 'ARUN KUMAR PATEL';
    if (!settingsObj.SHOP_TAGLINE) settingsObj.SHOP_TAGLINE = 'BATTERY • INVERTER • SOLAR • ELECTRICAL SOLUTIONS';
    if (!settingsObj.SHOP_ADDRESS) settingsObj.SHOP_ADDRESS = 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi';

    res.json({ success: true, data: settingsObj });
  });
};

const fs = require('fs');
const path = require('path');

function syncEnvKey(key, value) {
  try {
    const envPath = path.join(__dirname, '..', '..', '.env');
    if (!fs.existsSync(envPath)) return;
    let content = fs.readFileSync(envPath, 'utf8');
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
    fs.writeFileSync(envPath, content, 'utf8');
  } catch (err) {
    console.warn('Could not sync key to .env:', key, err.message);
  }
}

// PUT /api/settings (Admin only - update configurable settings)
exports.updateSettings = (req, res) => {
  const updates = req.body; // e.g. { SHOP_PHONE_NUMBER: '9876543210', SHOP_EMAIL: '...' }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid payload.' });
  }

  const allowedKeys = ['SHOP_PHONE_NUMBER', 'SHOP_EMAIL', 'SHOP_ADDRESS', 'SHOP_OWNER', 'SHOP_TAGLINE', 'MAPS_QUERY'];

  db.serialize(() => {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

    for (const [key, value] of Object.entries(updates)) {
      if (allowedKeys.includes(key)) {
        const valStr = (value || '').trim();
        stmt.run(key, valStr);
        syncEnvKey(key, valStr);
      }
    }

    stmt.finalize(err => {
      if (err) {
        console.error('Error saving settings:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to update settings.' });
      }
      res.json({ success: true, message: 'Shop settings updated successfully.' });
    });
  });
};

// GET /api/services (Public - returns service offerings)
exports.getServices = (req, res) => {
  db.all('SELECT * FROM services ORDER BY id ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to load services.' });
    }
    res.json({ success: true, count: rows.length, data: rows });
  });
};

// GET /api/dashboard/stats (Admin only)
exports.getDashboardStats = (req, res) => {
  const queries = {
    totalProducts: 'SELECT COUNT(*) as count FROM products',
    inStockProducts: "SELECT COUNT(*) as count FROM products WHERE availability = 'In Stock'",
    totalEnquiries: 'SELECT COUNT(*) as count FROM enquiries',
    newEnquiries: "SELECT COUNT(*) as count FROM enquiries WHERE status = 'NEW'",
    contactedEnquiries: "SELECT COUNT(*) as count FROM enquiries WHERE status = 'CONTACTED'",
    completedEnquiries: "SELECT COUNT(*) as count FROM enquiries WHERE status = 'COMPLETED'",
    totalSlides: 'SELECT COUNT(*) as count FROM slider_slides',
    activeSlides: 'SELECT COUNT(*) as count FROM slider_slides WHERE is_active = 1'
  };

  const results = {};
  let pending = Object.keys(queries).length;

  for (const [key, sql] of Object.entries(queries)) {
    db.get(sql, (err, row) => {
      results[key] = row ? row.count : 0;
      pending--;
      if (pending === 0) {
        res.json({ success: true, data: results });
      }
    });
  }
};
