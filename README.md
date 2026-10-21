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

7. **Production-Ready Homepage Slider Management**:
   - Dynamic slide rendering on the public storefront (`GET /api/slides`) with rock-solid fallback.
   - Admin management panel: **"Manage Homepage Slider"** (`/admin`).
   - Image upload from mobile or desktop with live preview before saving.
   - Edit slide titles, descriptions, badge pills, button labels, and target links.
   - One-click visibility toggle (Enable / Disable) and instant Up/Down display reordering.
   - Immediate live reflection without redeployment or Git commits.
   - **Persistent Storage**: Integrates with **Cloudinary** (recommended for Cloudflare / cloud hosting) or local persistent directory (`UPLOADS_PATH`).

8. **Discreet Admin Console (Footer ONLY)**:
   - **NO ADMIN LOGIN IN THE NAVBAR**.
   - Accessible only through the subtle `Admin Login` link in the footer or direct `/admin` URL.
   - Admin credentials configured in `.env` (Default: `admin@maasharada.com` / `MaaSharada@2026`).
   - Admin features: KPI metrics, Homepage Slider Management, Product Catalog CRUD, In-Stock toggles, Bookings management (`NEW`, `CONTACTED`, `COMPLETED`), and Shop Settings.

---

## ☁️ Persistent Image Storage Configuration

For cloud deployment (e.g., Cloudflare Pages), persistent cloud image storage is easily configured:

### Option 1: Cloudinary (Free Cloud Storage)
1. Register a free account at [Cloudinary](https://cloudinary.com).
2. Retrieve your **Cloud Name**, **API Key**, and **API Secret** from your Cloudinary console.
3. Add the following variables to Cloudflare Pages Environment Variables (or `.env`):
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
When configured, all uploaded slider images stream directly to Cloudinary and persist permanently in the cloud.

### Option 2: Local Server Storage
If running on a local machine or server with local disk storage:
```env
DATABASE_PATH=./database/shop.db
UPLOADS_PATH=./public/uploads/slider
```

---

## 📁 Project Structure

```
MAA-SHARDA PVT/
├── database/
│   ├── database.js          # SQLite setup, tables (slider_slides, products, etc.) & automated seeders
│   └── shop.db              # SQLite database file
├── server/
│   ├── server.js            # Express app, security, static routing & error handling
│   ├── routes/              # Express API routers (slider, products, enquiries, auth, settings)
│   ├── controllers/         # Handlers (sliderController, productController, etc.)
│   ├── services/            # Storage service (Cloudinary / Volume disk adapter)
│   └── middleware/          # JWT auth & enquiry validation
├── public/
│   ├── index.html           # Main storefront with dynamic hero slider & fallback
│   ├── admin.html           # Admin Console with "Manage Homepage Slider"
│   ├── css/
│   │   ├── style.css        # Storefront design system & responsive hero slider
│   │   └── admin.css        # Admin console styling & slider manager controls
│   ├── js/
│   │   ├── app.js           # Dynamic slider loader, catalogue filters, booking modals
│   │   └── admin.js         # Slider CRUD, live image preview, reordering, status toggles
│   ├── uploads/slider/      # Local/volume persistent uploads directory
│   └── images/              # High-resolution product, brand & default hero photography
├── .env                     # Private environment configuration
├── .env.example             # Template with persistent storage variables
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
