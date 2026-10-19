const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const defaultDbPath = path.join(__dirname, 'shop.db');
const rawDbPath = (process.env.DATABASE_PATH && process.env.DATABASE_PATH.trim())
  ? process.env.DATABASE_PATH.trim()
  : defaultDbPath;

// Safely resolve path (handles both absolute paths like /database/shop.db and relative paths like ./database/shop.db)
const dbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(process.cwd(), rawDbPath);

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (dirErr) {
    console.error('Error creating SQLite database directory:', dirErr.message);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database at ' + dbPath + ':', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    // Configure busy timeout for safe concurrent operations
    db.configure('busyTimeout', 5000);
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // 1. Settings Table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Admin Users Table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 3. Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
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
    )`);

    // 4. Enquiries Table
    db.run(`CREATE TABLE IF NOT EXISTS enquiries (
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
    )`);

    // 5. Services Table
    db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      icon TEXT,
      category TEXT,
      description TEXT,
      availability TEXT DEFAULT 'Available'
    )`);

    seedDefaultData();
  });
}

function seedDefaultData() {
  // Check and seed settings
  db.get(`SELECT COUNT(*) as count FROM settings`, (err, row) => {
    if (err) return console.error('Settings count error:', err);
    if (row.count === 0) {
      const defaultSettings = [
        ['SHOP_NAME', 'MAA SHARADA ENTERPRISES'],
        ['SHOP_OWNER', 'ARUN KUMAR PATEL'],
        ['SHOP_TAGLINE', 'BATTERY • INVERTER • SOLAR • ELECTRICAL SOLUTIONS'],
        ['SHOP_ADDRESS', 'Panihari Road, Chaubeypur, Near Petrol Pump, Varanasi, Uttar Pradesh, India'],
        ['SHOP_PHONE_NUMBER', process.env.SHOP_PHONE_NUMBER || ''],
        ['SHOP_EMAIL', process.env.SHOP_EMAIL || ''],
        ['MAPS_QUERY', 'Panihari Road, Chaubeypur, Near Petrol Pump, Varanasi, Uttar Pradesh, India']
      ];
      const stmt = db.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)`);
      defaultSettings.forEach(([k, v]) => stmt.run(k, v));
      stmt.finalize();
      console.log('Default settings seeded.');
    }
  });

  // Check and seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@maasharada.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'MaaSharada@2026';
  db.get(`SELECT id FROM admin_users WHERE email = ?`, [adminEmail], (err, row) => {
    if (err) return console.error('Admin query error:', err);
    if (!row) {
      const hash = bcrypt.hashSync(adminPassword, 10);
      db.run(
        `INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)`,
        [adminEmail, hash, 'Admin Arun Patel'],
        (insertErr) => {
          if (insertErr) console.error('Error seeding admin:', insertErr);
          else console.log(`Default admin seeded with email: ${adminEmail}`);
        }
      );
    }
  });

  // Check and seed products with realistic photography
  db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
    if (err) return console.error('Products count error:', err);
    if (row.count === 0) {
      const products = [
        // AMARON - Major brand strongly featured
        {
          name: 'Amaron Hi-Life Automotive Car Battery',
          brand: 'AMARON',
          category: 'CAR BATTERIES',
          description: 'High performance, maintenance-free automotive battery engineered for long life and high heat tolerance in Indian road conditions.',
          image: 'images/products/amaron_car_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Amaron Pro Rider 4L Two-Wheeler Battery',
          brand: 'AMARON',
          category: '2-WHEELER BATTERIES',
          description: 'Compact VRLA motorcycle and scooter battery with high cranking power, vibration resistance, and zero maintenance.',
          image: 'images/products/amaron_4l_bike_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Amaron Pro Rider 5L Two-Wheeler Battery',
          brand: 'AMARON',
          category: '2-WHEELER BATTERIES',
          description: 'Heavy duty 5L motorcycle battery designed for self-start motorcycles and modern scooters with rapid recharge capability.',
          image: 'images/products/amaron_5l_bike_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Amaron Current Tall Tubular Inverter Battery',
          brand: 'AMARON',
          category: 'INVERTERS',
          description: 'Heavy duty tall tubular home inverter battery with float level indicators. Built for deep cycle discharge and long backup hours.',
          image: 'images/products/amaron_tall_tubular.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Amaron Long Life Inverter Battery',
          brand: 'AMARON',
          category: 'BATTERIES',
          description: 'Robust tubular construction offering dependable long backup life for homes and commercial establishments during power outages.',
          image: 'images/products/amaron_tall_tubular.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        },
        {
          name: 'Amaron Hiway Heavy Duty Commercial & Truck Battery',
          brand: 'AMARON',
          category: 'CAR BATTERIES',
          description: 'Heavy duty commercial vehicle battery engineered for trucks, buses, tractors, and commercial transport with extreme heat and vibration resistance.',
          image: 'images/products/amaron_hiway_truck_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },

        // EXIDE
        {
          name: 'Exide Mileage / Matrix Car Battery',
          brand: 'EXIDE',
          category: 'CAR BATTERIES',
          description: 'Durable automotive battery featuring robust internal grid design for dependable engine start across temperatures.',
          image: 'images/products/exide_car_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Exide Xplore Two-Wheeler Battery',
          brand: 'EXIDE',
          category: '2-WHEELER BATTERIES',
          description: 'Factory charged maintenance-free battery for motorbikes and scooters with spill-proof design and long service life.',
          image: 'images/products/exide_bike_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Exide Compact Small 12V Battery',
          brand: 'EXIDE',
          category: 'SMALL BATTERIES',
          description: 'Reliable compact battery for emergency lighting, security devices, and multi-purpose low voltage applications.',
          image: 'images/products/exide_bike_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        },

        // LUMINOUS
        {
          name: 'Luminous Inverlast Tall Tubular Inverter Battery',
          brand: 'LUMINOUS',
          category: 'INVERTERS',
          description: 'Engineered tall tubular battery with ceramic water level float plugs, ensuring uniform backup and minimal water loss.',
          image: 'images/products/luminous_inverter_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Luminous Eco Volt+ Pure Sine Wave Home Inverter UPS',
          brand: 'LUMINOUS',
          category: 'INVERTERS',
          description: 'Intelligent pure sine wave inverter system with digital LCD display, battery charging protection, and silent operation.',
          image: 'images/products/luminous_eco_volt_inverter.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },

        // SOLAR
        {
          name: 'High-Efficiency Monocrystalline Solar Panel',
          brand: 'OTHER',
          category: 'SOLAR PANELS',
          description: 'Premium monocrystalline photovoltaic solar module with anodized aluminum frame for high-output rooftop solar generation.',
          image: 'images/products/solar_panel.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },
        {
          name: 'Solar Hybrid Inverter & Battery Solution',
          brand: 'OTHER',
          category: 'SOLAR PANELS',
          description: 'Complete integrated solar backup solution combining solar charge controller, pure sine wave power inverter, and deep cycle battery.',
          image: 'images/products/pure_sine_wave_inverter.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 1
        },

        // BATTERY WATER & CHEMICALS
        {
          name: 'Demineralized Distilled Battery Water (5L)',
          brand: 'OTHER',
          category: 'BATTERY WATER',
          description: 'Laboratory grade demineralized pure distilled water for topping up tubular inverter batteries and car batteries to maximize life.',
          image: 'images/products/distilled_battery_water.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        },
        {
          name: 'Electrolyte Battery Acid Solution',
          brand: 'OTHER',
          category: 'BATTERY ACID',
          description: 'Standard specific gravity battery grade sulfuric acid electrolyte for lead acid battery initial filling and servicing.',
          image: 'images/products/distilled_battery_water.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        },

        // ELECTRICAL & LIGHTS
        {
          name: 'Energy Efficient LED Lights & Luminaire',
          brand: 'OTHER',
          category: 'LIGHTS',
          description: 'High lumen output LED lighting, bulbs, tube lights, and fixtures suitable for home, shop, and outdoor illumination.',
          image: 'images/products/solar_panel.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        },
        {
          name: 'Modular Electrical Switches & Wiring Accessories',
          brand: 'OTHER',
          category: 'ELECTRICAL ITEMS',
          description: 'Quality electrical switches, sockets, circuit breakers (MCBs), copper multi-strand cables, and extension boards.',
          image: 'images/products/pure_sine_wave_inverter.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        },
        {
          name: 'Heavy-Duty Brass Battery Terminals & Clamps',
          brand: 'OTHER',
          category: 'OTHER ACCESSORIES',
          description: 'Pure brass heavy-duty corrosion-resistant battery terminal clamps and high-current insulated inverter connecting cables.',
          image: 'images/products/amaron_car_battery.jpg',
          price: 'Price available on enquiry',
          availability: 'In Stock',
          is_featured: 0
        }
      ];

      const stmt = db.prepare(`INSERT INTO products (name, brand, category, description, image, price, availability, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      products.forEach(p => {
        stmt.run(p.name, p.brand, p.category, p.description, p.image, p.price, p.availability, p.is_featured);
      });
      stmt.finalize();
      console.log('Seeded initial products successfully.');
    }
  });

  // Check and seed services
  db.get(`SELECT COUNT(*) as count FROM services`, (err, row) => {
    if (err) return console.error('Services count error:', err);
    if (row.count === 0) {
      const services = [
        { title: 'Battery Sale', icon: '🔋', category: 'Sales', description: 'Genuine automotive, inverter, commercial, and two-wheeler batteries from top brands.' },
        { title: 'Inverter Sale', icon: '⚡', category: 'Sales', description: 'Pure sine wave home inverters, UPS systems, and heavy backup power systems.' },
        { title: 'Battery Repair', icon: '🔧', category: 'Service', description: 'Terminal restoration, cell testing, desulphation, and physical maintenance.' },
        { title: 'Battery Charging', icon: '🔌', category: 'Service', description: 'Multi-stage bench charging with hydrometer gravity checks and rapid boost charging.' },
        { title: 'Solar Panel Sale', icon: '☀️', category: 'Solar', description: 'High-efficiency monocrystalline solar panels for residential and commercial rooftops.' },
        { title: 'Car Battery Replacement', icon: '🚗', category: 'Automotive', description: 'On-spot battery inspection, sizing, and replacement for all car makes.' },
        { title: 'Two Wheeler Battery', icon: '🛵', category: 'Automotive', description: 'Maintenance-free 4L and 5L motorcycle and scooter batteries with instant fitment.' },
        { title: 'Battery Distilled Water', icon: '💧', category: 'Supplies', description: 'Pure demineralized distilled water for regular tubular battery topping.' },
        { title: 'Battery Acid Solution', icon: '🧪', category: 'Supplies', description: 'Standard gravity battery acid electrolyte for battery conditioning and filling.' },
        { title: 'LED Lights & Fittings', icon: '💡', category: 'Electrical', description: 'Energy-saving LED bulbs, battens, focus lights, and emergency lights.' },
        { title: 'Photocopy Service', icon: '📄', category: 'Utility', description: 'Instant, clear black & white and color document photocopying.' },
        { title: 'Lamination Service', icon: '📑', category: 'Utility', description: 'Durable thermal document lamination for certificates, IDs, and cards.' },
        { title: 'Other Electrical Items', icon: '🔌', category: 'Electrical', description: 'MCBs, modular switches, copper wiring, sockets, tapes, and accessories.' }
      ];

      const stmt = db.prepare(`INSERT INTO services (title, icon, category, description, availability) VALUES (?, ?, ?, ?, ?)`);
      services.forEach(s => stmt.run(s.title, s.icon, s.category, s.description, 'Available'));
      stmt.finalize();
      console.log('Seeded services successfully.');
    }
  });
}

// Graceful shutdown handling
const closeDb = () => {
  db.close((err) => {
    if (err) console.error('Error closing SQLite DB:', err.message);
  });
};
process.on('SIGINT', closeDb);
process.on('SIGTERM', closeDb);

module.exports = db;
