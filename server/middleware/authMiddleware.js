const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'maa_sharada_enterprises_super_secure_key_2026';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Admin authentication required. Please log in.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ success: false, message: 'Admin session token missing. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session. Please log in again.' });
  }
}

module.exports = { requireAuth, JWT_SECRET };
