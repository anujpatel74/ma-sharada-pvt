require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Ensure database initializes and seeds
const db = require('../database/database');

const productsRouter = require('./routes/products');
const enquiriesRouter = require('./routes/enquiries');
const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/settings');
const sliderRouter = require('./routes/slider');
const storageService = require('./services/storageService');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Comprehensive CORS Configuration (allows http, localhost, and file:/// origin null)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle JSON parsing syntax errors gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400)) {
    console.warn('Malformed JSON payload intercepted:', err.message);
    return res.status(400).json({ success: false, message: 'Invalid JSON request body.' });
  }
  next(err);
});

// Serve static frontend assets
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Serve static uploads (local storage or persistent volume)
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));
try {
  const customUploadsDir = storageService.getUploadsDir();
  if (customUploadsDir && customUploadsDir !== path.join(publicDir, 'uploads', 'slider')) {
    app.use('/uploads/slider', express.static(customUploadsDir));
  }
} catch (staticErr) {
  console.warn('Custom uploads static serve notice:', staticErr.message);
}

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/admin', authRouter);
app.use('/api', settingsRouter);
app.use('/api', sliderRouter);

// Health check endpoint (for deployment monitoring & Railway liveness probe)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    business: 'MAA SHARADA ENTERPRISES',
    time: new Date().toISOString()
  });
});

// Admin portal route fallback (for direct URL navigation if refreshed)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

// SPA fallback to index.html for customer routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please contact shop for assistance.'
  });
});

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`⚡ MAA SHARADA ENTERPRISES WEB APP RUNNING ON ${HOST}:${PORT}`);
  console.log(`🌐 Customer Portal: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`🔐 Admin Access:    http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/admin (Also discreetly in footer)`);
  console.log(`====================================================`);
});
