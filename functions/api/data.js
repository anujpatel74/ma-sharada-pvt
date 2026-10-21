// Cloudflare Pages Functions - Default Seed Data
// Used automatically when Cloudflare D1 database is not yet bound or as fallback

export const defaultSettings = {
  SHOP_NAME: 'MAA SHARADA ENTERPRISES',
  SHOP_OWNER: 'ARUN KUMAR PATEL',
  SHOP_TAGLINE: 'BATTERY • INVERTER • SOLAR • ELECTRICAL SOLUTIONS',
  SHOP_ADDRESS: 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi',
  SHOP_PHONE_NUMBER: '+91 63868 50612',
  SHOP_EMAIL: 'contact@maasharada.com',
  MAPS_QUERY: 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi'
};

export const defaultSlides = [
  {
    id: 1,
    title: 'Power Backup You Can Trust',
    subtitle: 'Quality batteries and inverters for your home, shop and business.',
    badge_text: 'Inverters & Batteries',
    badge_icon: 'fas fa-bolt',
    badge_color: 'default',
    button_text: 'Explore Products',
    button_link: '#products',
    secondary_button_text: 'Call Now',
    secondary_button_link: 'tel:+916386850612',
    image_url: 'images/hero/slider_battery_inverter.png',
    display_order: 1,
    is_active: 1
  },
  {
    id: 2,
    title: 'Switch to Solar Energy',
    subtitle: 'Explore solar solutions for a brighter and energy-efficient future.',
    badge_text: 'Solar Energy Solutions',
    badge_icon: 'fas fa-sun',
    badge_color: 'solar',
    button_text: 'Enquire Now',
    button_link: '#solar',
    secondary_button_text: '',
    secondary_button_link: '',
    image_url: 'images/hero/slider_solar_energy.jpg',
    display_order: 2,
    is_active: 1
  },
  {
    id: 3,
    title: 'Battery Care & Reliable Service',
    subtitle: 'Get assistance with battery testing, charging and repair services.',
    badge_text: 'Diagnostic & Bench Service',
    badge_icon: 'fas fa-wrench',
    badge_color: 'amber',
    button_text: 'Contact Us',
    button_link: '#contact',
    secondary_button_text: '',
    secondary_button_link: '',
    image_url: 'images/hero/slider_battery_repair.jpg',
    display_order: 3,
    is_active: 1
  },
  {
    id: 4,
    title: 'Your Everyday Business Needs',
    subtitle: 'Photocopy and lamination services at MAA SHARADA ENTERPRISES.',
    badge_text: 'Shop Utility Services',
    badge_icon: 'fas fa-print',
    badge_color: 'purple',
    button_text: 'Visit Our Shop',
    button_link: '#contact',
    secondary_button_text: '',
    secondary_button_link: '',
    image_url: 'images/hero/slider_photocopy_lamination.jpg',
    display_order: 4,
    is_active: 1
  }
];

export const defaultServices = [
  { id: 1, title: 'Battery Sale', icon: '🔋', category: 'Sales', description: 'Genuine automotive, inverter, commercial, and two-wheeler batteries from top brands.', availability: 'Available' },
  { id: 2, title: 'Inverter Sale', icon: '⚡', category: 'Sales', description: 'Pure sine wave home inverters, UPS systems, and heavy backup power systems.', availability: 'Available' },
  { id: 3, title: 'Battery Repair', icon: '🔧', category: 'Service', description: 'Terminal restoration, cell testing, desulphation, and physical maintenance.', availability: 'Available' },
  { id: 4, title: 'Battery Charging', icon: '🔌', category: 'Service', description: 'Multi-stage bench charging with hydrometer gravity checks and rapid boost charging.', availability: 'Available' },
  { id: 5, title: 'Solar Panel Sale', icon: '☀️', category: 'Solar', description: 'High-efficiency monocrystalline solar panels for residential and commercial rooftops.', availability: 'Available' },
  { id: 6, title: 'Car Battery Replacement', icon: '🚗', category: 'Automotive', description: 'On-spot battery inspection, sizing, and replacement for all car makes.', availability: 'Available' },
  { id: 7, title: 'Two Wheeler Battery', icon: '🛵', category: 'Automotive', description: 'Maintenance-free 4L and 5L motorcycle and scooter batteries with instant fitment.', availability: 'Available' },
  { id: 8, title: 'Battery Distilled Water', icon: '💧', category: 'Supplies', description: 'Pure demineralized distilled water for regular tubular battery topping.', availability: 'Available' },
  { id: 9, title: 'Battery Acid Solution', icon: '🧪', category: 'Supplies', description: 'Standard gravity battery acid electrolyte for battery conditioning and filling.', availability: 'Available' },
  { id: 10, title: 'LED Lights & Fittings', icon: '💡', category: 'Electrical', description: 'Energy-saving LED bulbs, battens, focus lights, and emergency lights.', availability: 'Available' },
  { id: 11, title: 'Photocopy Service', icon: '📄', category: 'Utility', description: 'Instant, clear black & white and color document photocopying.', availability: 'Available' },
  { id: 12, title: 'Lamination Service', icon: '📑', category: 'Utility', description: 'Durable thermal document lamination for certificates, IDs, and cards.', availability: 'Available' },
  { id: 13, title: 'Other Electrical Items', icon: '🔌', category: 'Electrical', description: 'MCBs, modular switches, copper wiring, sockets, tapes, and accessories.', availability: 'Available' }
];

export const defaultProducts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
    name: 'Amaron Hiway Heavy Duty Commercial & Truck Battery',
    brand: 'AMARON',
    category: 'CAR BATTERIES',
    description: 'Heavy duty commercial vehicle battery engineered for trucks, buses, tractors, and commercial transport with extreme heat and vibration resistance.',
    image: 'images/products/amaron_hiway_truck_battery.jpg',
    price: 'Price available on enquiry',
    availability: 'In Stock',
    is_featured: 1
  },
  {
    id: 7,
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
    id: 8,
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
    id: 9,
    name: 'Exide Compact Small 12V Battery',
    brand: 'EXIDE',
    category: 'SMALL BATTERIES',
    description: 'Reliable compact battery for emergency lighting, security devices, and multi-purpose low voltage applications.',
    image: 'images/products/exide_bike_battery.jpg',
    price: 'Price available on enquiry',
    availability: 'In Stock',
    is_featured: 0
  },
  {
    id: 10,
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
    id: 11,
    name: 'Luminous Eco Volt+ Pure Sine Wave Home Inverter UPS',
    brand: 'LUMINOUS',
    category: 'INVERTERS',
    description: 'Intelligent pure sine wave inverter system with digital LCD display, battery charging protection, and silent operation.',
    image: 'images/products/luminous_eco_volt_inverter.jpg',
    price: 'Price available on enquiry',
    availability: 'In Stock',
    is_featured: 1
  },
  {
    id: 12,
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
    id: 13,
    name: 'Solar Hybrid Inverter & Battery Solution',
    brand: 'OTHER',
    category: 'SOLAR PANELS',
    description: 'Complete integrated solar backup solution combining solar charge controller, pure sine wave power inverter, and deep cycle battery.',
    image: 'images/products/pure_sine_wave_inverter.jpg',
    price: 'Price available on enquiry',
    availability: 'In Stock',
    is_featured: 1
  },
  {
    id: 14,
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
    id: 15,
    name: 'Electrolyte Battery Acid Solution',
    brand: 'OTHER',
    category: 'BATTERY ACID',
    description: 'Standard specific gravity battery grade sulfuric acid electrolyte for lead acid battery initial filling and servicing.',
    image: 'images/products/distilled_battery_water.jpg',
    price: 'Price available on enquiry',
    availability: 'In Stock',
    is_featured: 0
  },
  {
    id: 16,
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
    id: 17,
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
    id: 18,
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

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  });
}
