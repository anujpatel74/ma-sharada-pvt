# MAA SHARADA ENTERPRISES — Web Application

A professional, modern, fast, and production-ready business web application engineered for **MAA SHARADA ENTERPRISES**, located in Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi.

Owner: **ARUN KUMAR PATEL**  
Offerings: **Battery • Inverter • Solar • Electrical Products • Repair & Charging Services**

---

## 🚀 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Luxury Dark Navy & Electric Cyan Theme), Vanilla JavaScript (Zero bloated frameworks, ultra-fast, mobile responsive)
- **Backend**: Node.js & Express.js
- **Database**: SQLite3 (`database/shop.db`)
- **Authentication**: JWT & Bcrypt (For the secure discreet Admin Console)

---

## 🔋 Core Highlights & Features

1. **Brand Identity**:
   - Deep Navy Blue, Electric Cyan, Crisp White, with Amber and Solar Green accents.
   - Distinctive spotlight for **AMARON** batteries (the shop's key battery brand).
   - Real, authentic studio product visuals for Amaron automotive & motorcycle batteries (4L/5L), tall tubular inverter batteries, Exide, Luminous, Goldstar, solar panels, and bench charging facilities.

2. **Customer Catalogue & Live Search**:
   - Live filtering by keywords (e.g. `Amaron`, `Exide`, `4L`, `5L`, `Car`, `Bike`, `Solar`, `Inverter`, `Water`).
   - Dynamic brand tabs: `ALL`, `AMARON`, `EXIDE`, `LUMINOUS`, `GOLDSTAR`, `OTHER`.
   - Category filtering: Batteries, Inverters, Solar Panels, Car Batteries, 2-Wheeler Batteries, Small Batteries, Electrical Items, Lights, Battery Water, Battery Acid, Accessories.
   - Availability filtering: `In Stock`, `Available on Order`.
   - Clear pricing display: `"Price available on enquiry"` (or exact price if configured by admin).

3. **Customer Enquiry Flow (No Fake Payments)**:
   - Dedicated enquiry modal triggered from any product or service card.
   - Form fields: Full Name \*, Indian Mobile Number \* (10 digits starting with 6, 7, 8, or 9), Email, Address, Selected Product, Quantity, Message.
   - Anti-spam honeypot protection & input sanitization.
   - Submissions persist to SQLite database with status `NEW`.
   - Exact customer feedback confirmation:
     > *"Thank you! Your enquiry has been submitted successfully. MAA SHARADA ENTERPRISES will contact you soon."*

4. **Configurable Helpline (`SHOP_PHONE_NUMBER`)**:
   - Admin can configure the official phone number via the Admin Settings panel.
   - When set, calls and WhatsApp chat (`wa.me`) immediately link to this number site-wide.
   - If not set, website safely displays `"Helpline number coming soon"`.

5. **13 Complete Services**:
   - 🔋 Battery Sale, ⚡ Inverter Sale, 🔧 Battery Repair, 🔌 Battery Charging, ☀️ Solar Panel Sale, 🚗 Car Battery, 🛵 Two Wheeler Battery, 💧 Battery Water, 🧪 Battery Acid, 💡 Lights, 📄 Photocopy, 📑 Lamination, 🔌 Other Electrical Items.

6. **Dedicated Solar Section**:
   - Solar Panels, Solar Batteries, Solar Inverter Solutions, Solar Accessories.

7. **Discreet Admin Console (Footer ONLY)**:
   - **NO ADMIN LOGIN IN THE NAVBAR**.
   - Accessible only through the tiny, subtle `Admin Login` link at the very bottom of the footer or direct `/admin` URL.
   - Admin credentials configured in `.env` (Default: `admin@maasharada.com` / `MaaSharada@2026`).
   - Admin features: KPI dashboard, Add / Edit / Delete products, Toggle In-Stock status, View & manage enquiries (`NEW`, `CONTACTED`, `COMPLETED`), configure global shop settings.

---

## 📁 Project Structure

```
MAA-SHARDA PVT/
├── database/
│   ├── database.js          # SQLite setup, tables & automated seeders
│   └── shop.db              # SQLite database file
├── server/
│   ├── server.js            # Express app, security, static routing & error handling
│   ├── routes/              # Express API routers (products, enquiries, auth, settings)
│   ├── controllers/         # Business logic handlers
│   └── middleware/          # JWT auth & enquiry validation
├── public/
│   ├── index.html           # Main customer-facing storefront
│   ├── admin.html           # Private Admin Command Center
│   ├── css/
│   │   ├── style.css        # Core design system & responsive styling
│   │   └── admin.css        # Admin dashboard styling
│   ├── js/
│   │   ├── app.js           # Client search, filters, modals, enquiries
│   │   └── admin.js         # Admin authentication, CRUD, status management
│   └── images/
│       ├── products/        # High-res real battery & solar product images
│       ├── services/        # Battery charging bench & repair photography
│       ├── hero/            # Hero 3D energy showcase & Goldstar banners
│       └── brands/          # Vector SVG logos (Amaron, Exide, Luminous, Goldstar)
├── .env                     # Private environment secrets
├── .env.example             # Template for public deployment
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Application**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   - Storefront: `http://localhost:5000`
   - Admin Console: `http://localhost:5000/admin` (or click `Admin Login` in the footer)
   - Default Admin Login:
     - **Email**: `admin@maasharada.com`
     - **Password**: `MaaSharada@2026`
