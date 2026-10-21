const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database', 'shop.db');
const outputPath = path.join(__dirname, '..', 'database', 'd1-seed.sql');

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening shop.db:', err.message);
    process.exit(1);
  }
});

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

async function exportToD1() {
  const tables = ['settings', 'admin_users', 'products', 'services', 'slider_slides', 'enquiries'];
  let sqlDump = `-- ==============================================================================
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

`;

  for (const table of tables) {
    await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) return reject(err);
        sqlDump += `\n-- Data for ${table} (${rows.length} rows)\n`;
        if (rows.length > 0) {
          rows.forEach((row) => {
            const cols = Object.keys(row);
            const vals = cols.map(c => escapeSql(row[c]));
            sqlDump += `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${vals.join(', ')});\n`;
          });
        }
        resolve();
      });
    });
  }

  fs.writeFileSync(outputPath, sqlDump, 'utf8');
  console.log(`D1 Seed script exported successfully to: ${outputPath}`);
  db.close();
}

exportToD1().catch(err => {
  console.error('Export error:', err);
  process.exit(1);
});
