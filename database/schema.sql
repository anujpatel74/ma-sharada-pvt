-- ==============================================================================
-- Cloudflare D1 Database Schema for MAA SHARADA ENTERPRISES
-- Run: npx wrangler d1 execute maa-sharda-db --file=./database/schema.sql
-- ==============================================================================

-- 1. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  price TEXT DEFAULT 'Price available on enquiry',
  availability TEXT DEFAULT 'In Stock',
  is_featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  address TEXT,
  product_id INTEGER,
  product_name TEXT,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'NEW',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Services Table
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  description TEXT,
  availability TEXT DEFAULT 'Available'
);

-- 6. Slider Slides Table
CREATE TABLE IF NOT EXISTS slider_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  badge_text TEXT,
  badge_icon TEXT DEFAULT 'fas fa-bolt',
  badge_color TEXT DEFAULT 'default',
  button_text TEXT DEFAULT 'Explore Products',
  button_link TEXT DEFAULT '#products',
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  image_url TEXT NOT NULL,
  image_public_id TEXT,
  storage_type TEXT DEFAULT 'local',
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slider_slides_order ON slider_slides(display_order, is_active);

-- Seed Settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('SHOP_NAME', 'MAA SHARADA ENTERPRISES'),
  ('SHOP_OWNER', 'ARUN KUMAR PATEL'),
  ('SHOP_TAGLINE', 'BATTERY • INVERTER • SOLAR • ELECTRICAL SOLUTIONS'),
  ('SHOP_ADDRESS', 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi'),
  ('SHOP_PHONE_NUMBER', '+91 63868 50612'),
  ('SHOP_EMAIL', 'contact@maasharada.com'),
  ('MAPS_QUERY', 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi');

-- Seed Admin
INSERT OR IGNORE INTO admin_users (id, email, password_hash, name) VALUES
  (1, 'admin@maasharada.com', '$2b$10$wT0lF3iWsk.4Qh17W2a29.8gZkQvJ0C4F6aE9H3b5.yG1q2.3.4e', 'Admin Arun Patel');

-- Seed Slides
INSERT OR IGNORE INTO slider_slides (id, title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, secondary_button_text, secondary_button_link, image_url, display_order, is_active) VALUES
  (1, 'Power Backup You Can Trust', 'Quality batteries and inverters for your home, shop and business.', 'Inverters & Batteries', 'fas fa-bolt', 'default', 'Explore Products', '#products', 'Call Now', 'tel:+916386850612', 'images/hero/slider_battery_inverter.png', 1, 1),
  (2, 'Switch to Solar Energy', 'Explore solar solutions for a brighter and energy-efficient future.', 'Solar Energy Solutions', 'fas fa-sun', 'solar', 'Enquire Now', '#solar', '', '', 'images/hero/slider_solar_energy.jpg', 2, 1),
  (3, 'Battery Care & Reliable Service', 'Get assistance with battery testing, charging and repair services.', 'Diagnostic & Bench Service', 'fas fa-wrench', 'amber', 'Contact Us', '#contact', '', '', 'images/hero/slider_battery_repair.jpg', 3, 1),
  (4, 'Your Everyday Business Needs', 'Photocopy and lamination services at MAA SHARADA ENTERPRISES.', 'Shop Utility Services', 'fas fa-print', 'purple', 'Visit Our Shop', '#contact', '', '', 'images/hero/slider_photocopy_lamination.jpg', 4, 1);
