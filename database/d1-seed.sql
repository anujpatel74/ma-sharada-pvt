-- ==============================================================================
-- Cloudflare D1 Migration & Seed Script (Generated from database/shop.db)
-- MAA SHARADA ENTERPRISES
-- Execute with: npx wrangler d1 execute maa-sharda-db --file=./database/d1-seed.sql
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


-- Data for settings (7 rows)
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('SHOP_NAME', 'MAA SHARADA ENTERPRISES', '2026-10-18 03:43:19');
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('SHOP_PHONE_NUMBER', '+91 63868 50612', '2026-10-18 05:54:36');
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('SHOP_EMAIL', 'contact@maasharada.com', '2026-10-18 05:54:36');
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('SHOP_OWNER', 'ARUN KUMAR PATEL', '2026-10-18 05:54:36');
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('SHOP_ADDRESS', 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi', '2026-10-20 08:44:13');
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('SHOP_TAGLINE', 'BATTERY • INVERTER • SOLAR • ELECTRICAL SOLUTIONS', '2026-10-18 05:54:36');
INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('MAPS_QUERY', 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi', '2026-10-20 08:44:13');

-- Data for admin_users (1 rows)
INSERT OR REPLACE INTO admin_users (id, email, password_hash, name, created_at) VALUES (1, 'admin@maasharada.com', '$2b$10$JU0.4eP/WDlbZgQ97QDwVebcjvpGaWai6BGoiR2AyJem4L/bnP1Dm', 'Admin Arun Patel', '2026-10-18 03:43:19');

-- Data for products (18 rows)
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (1, 'Amaron Hi-Life Automotive Car Battery', 'AMARON', 'CAR BATTERIES', 'High performance, maintenance-free automotive battery engineered for long life and high heat tolerance in Indian road conditions.', 'images/products/amaron_car_battery.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (2, 'Amaron Pro Rider 4L Two-Wheeler Battery', 'AMARON', '2-WHEELER BATTERIES', 'Compact VRLA motorcycle and scooter battery with high cranking power, vibration resistance, and zero maintenance.', 'images/products/amaron_4l_bike_battery.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (3, 'Amaron Pro Rider 5L Two-Wheeler Battery', 'AMARON', '2-WHEELER BATTERIES', 'Heavy duty 5L motorcycle battery designed for self-start motorcycles and modern scooters with rapid recharge capability.', 'images/products/amaron_5l_bike_battery.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (4, 'Amaron Current Tall Tubular Inverter Battery', 'AMARON', 'INVERTERS', 'Heavy duty tall tubular home inverter battery with float level indicators. Built for deep cycle discharge and long backup hours.', 'images/products/amaron_tall_tubular.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (5, 'Amaron Long Life Inverter Battery', 'AMARON', 'BATTERIES', 'Robust tubular construction offering dependable long backup life for homes and commercial establishments during power outages.', 'images/products/amaron_tall_tubular.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (6, 'Amaron Hiway Heavy Duty Commercial & Truck Battery', 'AMARON', 'CAR BATTERIES', 'Heavy duty commercial vehicle battery engineered for trucks, buses, tractors, and commercial transport with extreme heat and vibration resistance.', 'images/products/amaron_hiway_truck_battery.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (7, 'Exide Mileage / Matrix Car Battery', 'EXIDE', 'CAR BATTERIES', 'Durable automotive battery featuring robust internal grid design for dependable engine start across temperatures.', 'images/products/exide_car_battery.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (8, 'Exide Xplore Two-Wheeler Battery', 'EXIDE', '2-WHEELER BATTERIES', 'Factory charged maintenance-free battery for motorbikes and scooters with spill-proof design and long service life.', 'images/products/exide_bike_battery.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (9, 'Exide Compact Small 12V Battery', 'EXIDE', 'SMALL BATTERIES', 'Reliable compact battery for emergency lighting, security devices, and multi-purpose low voltage applications.', 'images/products/exide_bike_battery.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (10, 'Luminous Inverlast Tall Tubular Inverter Battery', 'LUMINOUS', 'INVERTERS', 'Engineered tall tubular battery with ceramic water level float plugs, ensuring uniform backup and minimal water loss.', 'images/products/luminous_inverter_battery.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (11, 'Luminous Eco Volt+ Pure Sine Wave Home Inverter UPS', 'LUMINOUS', 'INVERTERS', 'Intelligent pure sine wave inverter system with digital LCD display, battery charging protection, and silent operation.', 'images/products/luminous_eco_volt_inverter.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (13, 'High-Efficiency Monocrystalline Solar Panel', 'OTHER', 'SOLAR PANELS', 'Premium monocrystalline photovoltaic solar module with anodized aluminum frame for high-output rooftop solar generation.', 'images/products/solar_panel.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (14, 'Solar Hybrid Inverter & Battery Solution', 'OTHER', 'SOLAR PANELS', 'Complete integrated solar backup solution combining solar charge controller, pure sine wave power inverter, and deep cycle battery.', 'images/products/pure_sine_wave_inverter.jpg', 'Price available on enquiry', 'In Stock', 1, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (15, 'Demineralized Distilled Battery Water (5L)', 'OTHER', 'BATTERY WATER', 'Laboratory grade demineralized pure distilled water for topping up tubular inverter batteries and car batteries to maximize life.', 'images/products/distilled_battery_water.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (16, 'Electrolyte Battery Acid Solution', 'OTHER', 'BATTERY ACID', 'Standard specific gravity battery grade sulfuric acid electrolyte for lead acid battery initial filling and servicing.', 'images/products/distilled_battery_water.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (17, 'Energy Efficient LED Lights & Luminaire', 'OTHER', 'LIGHTS', 'High lumen output LED lighting, bulbs, tube lights, and fixtures suitable for home, shop, and outdoor illumination.', 'images/products/solar_panel.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (18, 'Modular Electrical Switches & Wiring Accessories', 'OTHER', 'ELECTRICAL ITEMS', 'Quality electrical switches, sockets, circuit breakers (MCBs), copper multi-strand cables, and extension boards.', 'images/products/pure_sine_wave_inverter.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');
INSERT OR REPLACE INTO products (id, name, brand, category, description, image, price, availability, is_featured, created_at) VALUES (19, 'Heavy-Duty Brass Battery Terminals & Clamps', 'OTHER', 'OTHER ACCESSORIES', 'Pure brass heavy-duty corrosion-resistant battery terminal clamps and high-current insulated inverter connecting cables.', 'images/products/amaron_car_battery.jpg', 'Price available on enquiry', 'In Stock', 0, '2026-10-18 03:43:19');

-- Data for services (13 rows)
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (1, 'Battery Sale', '🔋', 'Sales', 'Genuine automotive, inverter, commercial, and two-wheeler batteries from top brands.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (2, 'Inverter Sale', '⚡', 'Sales', 'Pure sine wave home inverters, UPS systems, and heavy backup power systems.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (3, 'Battery Repair', '🔧', 'Service', 'Terminal restoration, cell testing, desulphation, and physical maintenance.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (4, 'Battery Charging', '🔌', 'Service', 'Multi-stage bench charging with hydrometer gravity checks and rapid boost charging.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (5, 'Solar Panel Sale', '☀️', 'Solar', 'High-efficiency monocrystalline solar panels for residential and commercial rooftops.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (6, 'Car Battery Replacement', '🚗', 'Automotive', 'On-spot battery inspection, sizing, and replacement for all car makes.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (7, 'Two Wheeler Battery', '🛵', 'Automotive', 'Maintenance-free 4L and 5L motorcycle and scooter batteries with instant fitment.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (8, 'Battery Distilled Water', '💧', 'Supplies', 'Pure demineralized distilled water for regular tubular battery topping.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (9, 'Battery Acid Solution', '🧪', 'Supplies', 'Standard gravity battery acid electrolyte for battery conditioning and filling.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (10, 'LED Lights & Fittings', '💡', 'Electrical', 'Energy-saving LED bulbs, battens, focus lights, and emergency lights.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (11, 'Photocopy Service', '📄', 'Utility', 'Instant, clear black & white and color document photocopying.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (12, 'Lamination Service', '📑', 'Utility', 'Durable thermal document lamination for certificates, IDs, and cards.', 'Available');
INSERT OR REPLACE INTO services (id, title, icon, category, description, availability) VALUES (13, 'Other Electrical Items', '🔌', 'Electrical', 'MCBs, modular switches, copper wiring, sockets, tapes, and accessories.', 'Available');

-- Data for slider_slides (4 rows)
INSERT OR REPLACE INTO slider_slides (id, title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, secondary_button_text, secondary_button_link, image_url, image_public_id, storage_type, display_order, is_active, created_at, updated_at) VALUES (1, 'Power Backup You Can Trust', 'Quality batteries and inverters for your home, shop and business.', 'Inverters & Batteries', 'fas fa-bolt', 'default', 'Explore Products', '#products', 'Call Now', 'tel:+916386850612', 'images/hero/slider_battery_inverter.png', NULL, 'local', 1, 1, '2026-10-21 02:11:26', '2026-10-21 02:12:45');
INSERT OR REPLACE INTO slider_slides (id, title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, secondary_button_text, secondary_button_link, image_url, image_public_id, storage_type, display_order, is_active, created_at, updated_at) VALUES (2, 'Switch to Solar Energy', 'Explore solar solutions for a brighter and energy-efficient future.', 'Solar Energy Solutions', 'fas fa-sun', 'solar', 'Enquire Now', '#solar', '', '', 'images/hero/slider_solar_energy.jpg', NULL, 'local', 2, 1, '2026-10-21 02:11:26', '2026-10-21 02:12:45');
INSERT OR REPLACE INTO slider_slides (id, title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, secondary_button_text, secondary_button_link, image_url, image_public_id, storage_type, display_order, is_active, created_at, updated_at) VALUES (3, 'Battery Care & Reliable Service', 'Get assistance with battery testing, charging and repair services.', 'Diagnostic & Bench Service', 'fas fa-wrench', 'amber', 'Contact Us', '#contact', '', '', 'images/hero/slider_battery_repair.jpg', NULL, 'local', 3, 1, '2026-10-21 02:11:26', '2026-10-21 02:12:45');
INSERT OR REPLACE INTO slider_slides (id, title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, secondary_button_text, secondary_button_link, image_url, image_public_id, storage_type, display_order, is_active, created_at, updated_at) VALUES (4, 'Your Everyday Business Needs', 'Photocopy and lamination services at MAA SHARADA ENTERPRISES.', 'Shop Utility Services', 'fas fa-print', 'purple', 'Visit Our Shop', '#contact', '', '', 'images/hero/slider_photocopy_lamination.jpg', NULL, 'local', 4, 1, '2026-10-21 02:11:26', '2026-10-21 02:12:45');

-- Data for enquiries (1 rows)
INSERT OR REPLACE INTO enquiries (id, customer_name, mobile, email, address, product_id, product_name, quantity, message, status, created_at) VALUES (11, 'Ramesh Patel', '9876543210', NULL, NULL, 1, 'AMARON - Amaron Hi-Life Automotive Car Battery', 1, 'Need battery for Swift Dzire', 'NEW', '2026-10-19 06:32:38');
