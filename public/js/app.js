const API_BASE = (() => {
  if (typeof window === 'undefined') return '';
  // 0. Custom backend override (e.g. when frontend is on Cloudflare Pages and backend is on Railway/Render)
  if (window.__BACKEND_URL__) return window.__BACKEND_URL__.replace(/\/+$/, '');
  try {
    const savedBackend = localStorage.getItem('BACKEND_URL');
    if (savedBackend) return savedBackend.replace(/\/+$/, '');
  } catch (e) {}
  // 1. If loaded from filesystem directly (file://)
  if (window.location.protocol === 'file:') return 'http://localhost:5000';
  // 2. If running on a local development server on a different port (e.g. Live Server on port 5500, or 3000, 5173, etc.)
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (isLocal && window.location.port !== '5000' && window.location.port !== '8787') {
    return `http://${host}:5000`;
  }
  // 3. Otherwise (served by Express server on port 5000, production domain, or Cloudflare Pages proxy)
  return '';
})();
/**
 * MAA SHARADA ENTERPRISES - Client Application Logic
 * Premium Dashboard & Catalogue Architecture
 * Location: Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi
 * Owner: ARUN KUMAR PATEL
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    products: [],
    services: [],
    settings: {
      SHOP_NAME: 'MAA SHARADA ENTERPRISES',
      SHOP_OWNER: 'ARUN KUMAR PATEL',
      SHOP_TAGLINE: 'Battery • Inverter • Solar • Electrical Solutions',
      SHOP_ADDRESS: 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi',
      SHOP_PHONE_NUMBER: '+91 63868 50612',
      SHOP_EMAIL: 'contact@maasharada.com',
      MAPS_QUERY: 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi'
    },
    activeBrand: 'ALL',
    activeCategory: 'ALL',
    activeAvailability: 'ALL',
    searchQuery: '',
    selectedProductForEnquiry: null
  };

  // DOM Elements
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const availabilityFilter = document.getElementById('availabilityFilter');
  const brandPillButtons = document.querySelectorAll('.brand-pill-btn');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const header = document.querySelector('.site-header');

  // Modals
  const productModal = document.getElementById('productDetailsModal');
  const enquiryModal = document.getElementById('enquiryModal');
  const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
  const enquiryForm = document.getElementById('enquiryForm');

  // Format image path safely for both http://, https://, /uploads/, and file:///
  function formatImagePath(path) {
    if (!path) return 'images/hero/slider_battery_inverter.png';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    if (path.startsWith('/uploads/')) {
      return API_BASE ? (API_BASE + path) : path;
    }
    return path.startsWith('/') ? path.substring(1) : path;
  }

  // Fallback products with real product photography
  const defaultProducts = [
    // Amaron Products Prioritized
    {
      id: 1,
      name: 'Amaron Hi-Life Automotive Car Battery',
      brand: 'AMARON',
      category: 'CAR BATTERIES',
      description: 'High performance, maintenance-free automotive battery engineered for long life and high heat tolerance in Indian road conditions.',
      image: 'images/products/amaron_car_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 2,
      name: 'Amaron Pro Rider 4L Two-Wheeler Battery',
      brand: 'AMARON',
      category: '2-WHEELER BATTERIES',
      description: 'Compact VRLA motorcycle and scooter battery with high cranking power, vibration resistance, and zero maintenance.',
      image: 'images/products/amaron_4l_bike_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 3,
      name: 'Amaron Pro Rider 5L Two-Wheeler Battery',
      brand: 'AMARON',
      category: '2-WHEELER BATTERIES',
      description: 'Heavy duty 5L motorcycle battery designed for self-start motorcycles and modern scooters with rapid recharge capability.',
      image: 'images/products/amaron_5l_bike_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 4,
      name: 'Amaron Current Tall Tubular Inverter Battery',
      brand: 'AMARON',
      category: 'INVERTERS',
      description: 'Heavy duty tall tubular home inverter battery with float level indicators. Built for deep cycle discharge and long backup hours.',
      image: 'images/products/amaron_tall_tubular.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 5,
      name: 'Amaron Long Life Inverter Battery',
      brand: 'AMARON',
      category: 'BATTERIES',
      description: 'Robust tubular construction offering dependable long backup life for homes and commercial establishments during power outages.',
      image: 'images/products/amaron_tall_tubular.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 6,
      name: 'Amaron Hiway Heavy Duty Commercial & Truck Battery',
      brand: 'AMARON',
      category: 'CAR BATTERIES',
      description: 'Heavy duty commercial vehicle battery engineered for trucks, buses, tractors, and commercial transport with extreme heat and vibration resistance.',
      image: 'images/products/amaron_hiway_truck_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },

    // Exide Products
    {
      id: 7,
      name: 'Exide Mileage / Matrix Car Battery',
      brand: 'EXIDE',
      category: 'CAR BATTERIES',
      description: 'Durable automotive battery featuring robust internal grid design for dependable engine start across temperatures.',
      image: 'images/products/exide_car_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 8,
      name: 'Exide Xplore Two-Wheeler Battery',
      brand: 'EXIDE',
      category: '2-WHEELER BATTERIES',
      description: 'Factory charged maintenance-free battery for motorbikes and scooters with spill-proof design and long service life.',
      image: 'images/products/exide_bike_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 9,
      name: 'Exide Compact Small 12V Battery',
      brand: 'EXIDE',
      category: 'SMALL BATTERIES',
      description: 'Reliable compact battery for emergency lighting, security devices, and multi-purpose low voltage applications.',
      image: 'images/products/exide_bike_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },

    // Luminous Products
    {
      id: 10,
      name: 'Luminous Inverlast Tall Tubular Inverter Battery',
      brand: 'LUMINOUS',
      category: 'INVERTERS',
      description: 'Engineered tall tubular battery with ceramic water level float plugs, ensuring uniform backup and minimal water loss.',
      image: 'images/products/luminous_inverter_battery.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 11,
      name: 'Luminous Eco Volt+ Pure Sine Wave Home Inverter UPS',
      brand: 'LUMINOUS',
      category: 'INVERTERS',
      description: 'Intelligent pure sine wave inverter system with digital LCD display, battery charging protection, and silent operation.',
      image: 'images/products/luminous_eco_volt_inverter.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },

    // Solar Products
    {
      id: 13,
      name: 'High-Efficiency Monocrystalline Solar Panel',
      brand: 'OTHER',
      category: 'SOLAR PANELS',
      description: 'Premium monocrystalline photovoltaic solar module with anodized aluminum frame for high-output rooftop solar generation.',
      image: 'images/products/solar_panel.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },

    // Battery Water & Chemical
    {
      id: 14,
      name: 'Demineralized Distilled Battery Water (5L)',
      brand: 'OTHER',
      category: 'BATTERY WATER',
      description: 'Laboratory grade demineralized pure distilled water for topping up tubular inverter batteries and car batteries to maximize life.',
      image: 'images/products/distilled_battery_water.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },
    {
      id: 15,
      name: 'Electrolyte Battery Acid Solution',
      brand: 'OTHER',
      category: 'BATTERY ACID',
      description: 'Standard specific gravity battery grade sulfuric acid electrolyte for lead acid battery initial filling and servicing.',
      image: 'images/products/distilled_battery_water.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    },

    // Electrical Items & Lights
    {
      id: 16,
      name: 'Modular Electrical Switches & Wiring Accessories',
      brand: 'OTHER',
      category: 'ELECTRICAL ITEMS',
      description: 'Quality electrical switches, sockets, circuit breakers (MCBs), copper multi-strand cables, and extension boards.',
      image: 'images/products/pure_sine_wave_inverter.jpg',
      price: 'Price available on enquiry',
      availability: 'In Stock'
    }
  ];

  // Authentic 14 Services offered at the Chaubeypur storefront
  const defaultServices = [
    { title: 'Battery Sale', icon: '🔋', category: 'Sales', description: 'Genuine automotive, inverter, commercial, and two-wheeler batteries from top brands.' },
    { title: 'Battery Repair', icon: '🔧', category: 'Service', description: 'Terminal restoration, cell testing, desulphation, and physical maintenance.' },
    { title: 'Battery Charging', icon: '🔌', category: 'Service', description: 'Multi-stage bench charging with hydrometer gravity checks and rapid boost charging.' },
    { title: 'Inverter Sale', icon: '⚡', category: 'Sales', description: 'Pure sine wave home inverters, UPS systems, and heavy backup power systems.' },
    { title: 'Solar Panel Sale', icon: '☀️', category: 'Solar', description: 'High-efficiency monocrystalline solar panels for residential and commercial rooftops.' },
    { title: 'Car Battery Replacement', icon: '🚗', category: 'Automotive', description: 'On-spot battery inspection, sizing, and replacement for all car makes.' },
    { title: 'Two Wheeler Battery', icon: '🛵', category: 'Automotive', description: 'Maintenance-free 4L and 5L motorcycle and scooter batteries with instant fitment.' },
    { title: 'Battery Distilled Water', icon: '💧', category: 'Supplies', description: 'Pure demineralized distilled water for regular tubular battery topping.' },
    { title: 'Battery Acid Solution', icon: '🧪', category: 'Supplies', description: 'Standard gravity battery acid electrolyte for battery conditioning and filling.' },
    { title: 'LED Lights & Fittings', icon: '💡', category: 'Electrical', description: 'Energy-saving LED bulbs, battens, focus lights, and emergency lights.' },
    { title: 'Photocopy Service (फोटो स्टेट)', icon: '📄', category: 'Utility', description: 'Instant, clear black & white and color document photocopying.' },
    { title: 'Lamination Service (लेमिनेशन)', icon: '📑', category: 'Utility', description: 'Durable thermal document lamination for certificates, IDs, and cards.' },
    { title: 'Gas Welding & Fabrication (गैस वेल्डिंग)', icon: '🔥', category: 'Fabrication', description: 'Specialized gas welding and metallic fabrication support.' },
    { title: 'Other Electrical Items', icon: '🔌', category: 'Electrical', description: 'MCBs, modular switches, copper wiring, sockets, tapes, and accessories.' }
  ];

  // ==========================================================================
  // DYNAMIC HERO SLIDER DATA LOADER & CONTROLLER
  // ==========================================================================
  async function loadHeroSlides() {
    const sliderTrack = document.getElementById('sliderTrack');
    if (!sliderTrack) {
      initHeroSlider();
      return;
    }

    try {
      const res = await fetch(API_BASE + '/api/slides');
      const json = await res.json();

      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        renderHeroSlides(json.data);
      }
    } catch (err) {
      console.warn('Hero slides API notice: Using built-in default slides.', err.message);
    } finally {
      initHeroSlider();
    }
  }

  function renderHeroSlides(slides) {
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDots = document.getElementById('sliderDots');
    if (!sliderTrack) return;

    const total = slides.length;

    sliderTrack.innerHTML = slides.map((s, idx) => {
      const isFirst = idx === 0;
      const imgPath = formatImagePath(s.image_url);
      const badgeIcon = s.badge_icon || 'fas fa-bolt';
      const badgeColor = s.badge_color || 'default';
      const badgeClass = (badgeColor && badgeColor !== 'default') ? badgeColor : '';
      const btnPrimaryClass = badgeColor === 'solar' ? 'solar' : (badgeColor === 'amber' ? 'amber' : '');

      return `
        <article class="slider-slide ${isFirst ? 'active' : ''}" data-index="${idx}" aria-roledescription="slide"
          aria-label="Slide ${idx + 1} of ${total}: ${escapeHTML(s.title)}" ${!isFirst ? 'aria-hidden="true"' : ''}>
          <div class="slide-bg">
            <img src="${escapeHTML(imgPath)}"
              alt="${escapeHTML(s.title)}"
              loading="${isFirst ? 'eager' : 'lazy'}"
              ${isFirst ? 'fetchpriority="high"' : ''}
              onerror="this.onerror=null; this.src='images/real_photos/shop_real_interior.jpg'">
            <div class="slide-overlay"></div>
          </div>
          <div class="container slide-content-wrapper">
            <div class="slide-content">
              ${s.badge_text ? `
                <span class="slide-badge-pill ${escapeHTML(badgeClass)}">
                  <i class="${escapeHTML(badgeIcon)}"></i> ${escapeHTML(s.badge_text)}
                </span>
              ` : ''}
              <${isFirst ? 'h1' : 'h2'} class="slide-heading">${escapeHTML(s.title)}</${isFirst ? 'h1' : 'h2'}>
              ${s.subtitle ? `<p class="slide-desc">${escapeHTML(s.subtitle)}</p>` : ''}
              <div class="slide-cta-row">
                ${s.button_text ? `
                  <a href="${escapeHTML(s.button_link || '#products')}" class="btn-slider-primary ${escapeHTML(btnPrimaryClass)}">
                    ${escapeHTML(s.button_text)}
                  </a>
                ` : ''}
                ${s.secondary_button_text ? `
                  <a href="${escapeHTML(s.secondary_button_link || 'tel:+916386850612')}" class="btn-slider-secondary shop-phone-call-btn">
                    <i class="fas fa-phone-alt"></i> ${escapeHTML(s.secondary_button_text)}
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (sliderDots) {
      sliderDots.innerHTML = slides.map((s, idx) => `
        <button class="slider-dot ${idx === 0 ? 'active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}"
          aria-label="Slide ${idx + 1}: ${escapeHTML(s.title)}" data-slide="${idx}"></button>
      `).join('');
    }

    // Sync phone number to dynamic call buttons if already loaded
    if (state.settings && state.settings.SHOP_PHONE_NUMBER) {
      updateShopPhoneInDOM(state.settings.SHOP_PHONE_NUMBER);
    }
  }

  // PREMIUM HERO IMAGE SLIDER CONTROLLER
  function initHeroSlider() {
    const sliderContainer = document.getElementById('heroSliderContainer') || document.querySelector('.hero-slider-section');
    if (!sliderContainer) return;

    const slides = sliderContainer.querySelectorAll('.slider-slide');
    const dots = sliderContainer.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('sliderPrevBtn');
    const nextBtn = document.getElementById('sliderNextBtn');
    const progressBar = document.getElementById('sliderProgressBar');

    if (!slides || slides.length === 0) return;

    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayTimer = null;
    let progressTimer = null;
    let progressStartTime = 0;
    const AUTOPLAY_DURATION = 5000; // 5 seconds interval
    let isPaused = false;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goToSlide(targetIndex, resetAutoplay = true) {
      const nextIndex = (targetIndex + totalSlides) % totalSlides;
      if (nextIndex === currentIndex && slides[currentIndex].classList.contains('active')) {
        if (resetAutoplay && !isPaused && !prefersReducedMotion) restartAutoplay();
        return;
      }

      // Update slide active states
      slides.forEach((slide, idx) => {
        if (idx === nextIndex) {
          slide.classList.add('active');
          slide.removeAttribute('aria-hidden');
        } else {
          slide.classList.remove('active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      // Update dot active states
      dots.forEach((dot, idx) => {
        const isCurrent = idx === nextIndex;
        dot.classList.toggle('active', isCurrent);
        dot.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      currentIndex = nextIndex;

      if (resetAutoplay && !isPaused && !prefersReducedMotion) {
        restartAutoplay();
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Smooth Progress Bar Animation
    function resetProgressBar() {
      if (!progressBar) return;
      cancelAnimationFrame(progressTimer);
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
    }

    function runProgressBar() {
      if (!progressBar || prefersReducedMotion) return;
      resetProgressBar();
      progressStartTime = performance.now();

      function step(now) {
        if (isPaused) return;
        const elapsed = now - progressStartTime;
        const percent = Math.min(100, (elapsed / AUTOPLAY_DURATION) * 100);
        progressBar.style.width = `${percent}%`;

        if (elapsed < AUTOPLAY_DURATION) {
          progressTimer = requestAnimationFrame(step);
        }
      }

      progressTimer = requestAnimationFrame(step);
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      clearTimeout(autoplayTimer);
      cancelAnimationFrame(progressTimer);
      runProgressBar();
      autoplayTimer = setTimeout(() => {
        nextSlide();
      }, AUTOPLAY_DURATION);
    }

    function pauseAutoplay() {
      isPaused = true;
      clearTimeout(autoplayTimer);
      cancelAnimationFrame(progressTimer);
    }

    function resumeAutoplay() {
      if (!isPaused) return;
      isPaused = false;
      if (!prefersReducedMotion) {
        startAutoplay();
      }
    }

    function restartAutoplay() {
      isPaused = false;
      clearTimeout(autoplayTimer);
      cancelAnimationFrame(progressTimer);
      startAutoplay();
    }

    // Attach Click Handlers to Arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Attach Click Handlers to Dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    // Pause on desktop hover
    sliderContainer.addEventListener('mouseenter', () => {
      pauseAutoplay();
    });

    sliderContainer.addEventListener('mouseleave', () => {
      resumeAutoplay();
    });

    // Pause on focus (keyboard users or interacting with controls)
    sliderContainer.addEventListener('focusin', () => {
      pauseAutoplay();
    });

    sliderContainer.addEventListener('focusout', (e) => {
      if (!sliderContainer.contains(e.relatedTarget)) {
        resumeAutoplay();
      }
    });

    // Visibility change: Pause when tab is inactive, resume when active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAutoplay();
      } else {
        resumeAutoplay();
      }
    });

    // Keyboard Navigation (Left / Right Arrow Keys)
    sliderContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });

    // Touch Swipe Gestures for Mobile Phones and Tablets
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const SWIPE_THRESHOLD = 40; // minimum distance in px

    sliderContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Ensure horizontal swipe is dominant over vertical scroll
        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
          if (deltaX < 0) {
            // Swiped Left -> Next Slide
            nextSlide();
          } else {
            // Swiped Right -> Previous Slide
            prevSlide();
          }
        }
      }
    }, { passive: true });

    // Initial setup
    goToSlide(0, false);
    if (!prefersReducedMotion) {
      startAutoplay();
    }
  }

  // Initialize
  initApp();

  async function initApp() {
    setupEventListeners();
    await loadHeroSlides();
    await loadSettings();
    await loadServices();
    await loadProducts();
    syncOfflineBookings();
  }

  // Sync buffered offline bookings if any
  async function syncOfflineBookings() {
    try {
      const raw = localStorage.getItem('mse_offline_bookings');
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return;

      const remaining = [];
      for (const booking of list) {
        try {
          const res = await fetch(API_BASE + '/api/enquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            remaining.push(booking);
          }
        } catch (e) {
          remaining.push(booking);
        }
      }
      if (remaining.length > 0) {
        localStorage.setItem('mse_offline_bookings', JSON.stringify(remaining));
      } else {
        localStorage.removeItem('mse_offline_bookings');
      }
    } catch (e) {}
  }

  // 1. Load Settings
  async function loadSettings() {
    // 1. Check local cache first for fast rendering
    try {
      const cached = JSON.parse(localStorage.getItem('mse_shop_settings') || '{}');
      if (cached && typeof cached === 'object') {
        state.settings = { ...state.settings, ...cached };
      }
    } catch (e) {}

    // 2. Fetch authoritative shop settings from server
    try {
      const res = await fetch(API_BASE + '/api/settings');
      const json = await res.json();
      if (json.success && json.data) {
        state.settings = { ...state.settings, ...json.data };
        // Sync fresh authoritative server settings into localStorage
        try {
          localStorage.setItem('mse_shop_settings', JSON.stringify(state.settings));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Using default settings (offline or file mode):', err);
    }

    updateUIWithSettings();
  }

  function updateUIWithSettings() {
    const phone = state.settings.SHOP_PHONE_NUMBER ? state.settings.SHOP_PHONE_NUMBER.trim() : '';

    const phoneDisplayElements = document.querySelectorAll('.shop-phone-display');
    const phoneCallButtons = document.querySelectorAll('.shop-phone-call-btn');
    const phoneWaButtons = document.querySelectorAll('.shop-phone-wa-btn');

    phoneDisplayElements.forEach(el => {
      const activePhone = phone || '+91 63868 50612';
      el.textContent = activePhone;
      if (el.tagName === 'A') {
        el.href = `tel:${activePhone.replace(/[\s\-]/g, '')}`;
      }
    });

    phoneCallButtons.forEach(btn => {
      if (phone) {
        btn.href = `tel:${phone}`;
        btn.removeAttribute('data-no-phone');
      } else {
        btn.href = '#support';
        btn.setAttribute('data-no-phone', 'true');
      }
    });

    phoneWaButtons.forEach(btn => {
      if (phone) {
        const cleanWa = phone.replace(/[^0-9]/g, '');
        const targetNumber = cleanWa.length === 10 ? `91${cleanWa}` : cleanWa;
        btn.href = `https://wa.me/${targetNumber}?text=${encodeURIComponent('Hello MAA SHARADA ENTERPRISES, I would like to enquire about battery / solar / inverter services.')}`;
        btn.removeAttribute('data-no-phone');
      } else {
        btn.href = '#support';
        btn.setAttribute('data-no-phone', 'true');
      }
    });

    const addressElements = document.querySelectorAll('.shop-address-display');
    addressElements.forEach(el => {
      if (state.settings.SHOP_ADDRESS) el.textContent = state.settings.SHOP_ADDRESS;
    });

    const mapBtns = document.querySelectorAll('.shop-map-link');
    mapBtns.forEach(btn => {
      const query = encodeURIComponent(state.settings.MAPS_QUERY || 'Gazipur road,Nearby Shahpur Aditya Petrol Pump,Panihari,Chaubepur Varanasi');
      btn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    });
  }

  // 2. Load Services
  async function loadServices() {
    try {
      const res = await fetch(API_BASE + '/api/services');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        state.services = json.data;
      } else {
        state.services = defaultServices;
      }
    } catch (err) {
      state.services = defaultServices;
    }
    renderServices(state.services);
  }

  function renderServices(services) {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = services.map(s => `
      <div class="service-card" data-service-title="${escapeHTML(s.title)}">
        <div class="service-icon-box">${s.icon || '⚡'}</div>
        <h3 class="service-title">${escapeHTML(s.title)}</h3>
        <p class="service-desc">${escapeHTML(s.description || 'Quality professional service at MAA SHARADA ENTERPRISES.')}</p>
        <div class="service-card-footer">
          <span class="service-status-pill">Available</span>
          <button class="btn-service-enquire" onclick="openEnquiryForService('${escapeHTML(s.title)}')">
            <span>Enquire</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // 3. Load Products
  async function loadProducts() {
    try {
      const res = await fetch(API_BASE + '/api/products');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        state.products = json.data;
      } else {
        state.products = defaultProducts;
      }
    } catch (err) {
      console.warn('Backend API unavailable, using embedded catalogue:', err);
      state.products = defaultProducts;
    }
    filterAndRenderProducts();
  }

  // 4. Filtering Logic with Amaron Prioritization
  function filterAndRenderProducts() {
    const query = state.searchQuery.toLowerCase().trim();
    const brand = state.activeBrand.toUpperCase();
    const category = state.activeCategory.toUpperCase();
    const availability = state.activeAvailability;

    let filtered = state.products.filter(p => {
      // Brand match
      if (brand !== 'ALL' && p.brand.toUpperCase() !== brand) return false;

      // Category match
      if (category !== 'ALL' && p.category.toUpperCase() !== category) return false;

      // Availability match
      if (availability !== 'ALL' && p.availability !== availability) return false;

      // Search query match
      if (query !== '') {
        const textToSearch = `${p.name} ${p.brand} ${p.category} ${p.description || ''}`.toLowerCase();
        const terms = query.split(' ').filter(t => t.length > 0);
        const matchesAll = terms.every(term => textToSearch.includes(term));
        if (!matchesAll) return false;
      }

      return true;
    });

    // STRICT REQUIREMENT: Prioritize AMARON products
    filtered.sort((a, b) => {
      const aIsAmaron = (a.brand || '').toUpperCase() === 'AMARON' ? 1 : 0;
      const bIsAmaron = (b.brand || '').toUpperCase() === 'AMARON' ? 1 : 0;
      return bIsAmaron - aIsAmaron;
    });

    renderProductsGrid(filtered);
  }

  // 5. Render Products Grid (Soft Pastel Cards)
  function renderProductsGrid(products) {
    if (!productsGrid) return;

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="catalogue-empty">
          <i class="fas fa-search"></i>
          <h3>No matching products found</h3>
          <p>Try clearing your filters or enquire directly with the shop.</p>
          <button class="btn-primary" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
      }
      return;
    }

    productsGrid.innerHTML = products.map(p => {
      const isAmaron = (p.brand || '').toUpperCase() === 'AMARON';
      const priceText = p.price && p.price.trim() !== '' ? escapeHTML(p.price) : 'Price available on enquiry';
      const imgPath = formatImagePath(p.image);

      return `
        <div class="product-card ${isAmaron ? 'amaron-highlight' : ''}" data-id="${p.id}">
          <div class="product-img-box">
            <span class="product-brand-badge ${isAmaron ? 'amaron' : ''}">${escapeHTML(p.brand)}</span>
            <span class="product-status-badge">
              <span class="pulse-dot"></span> ${escapeHTML(p.availability || 'In Stock')}
            </span>
            <img src="${escapeHTML(imgPath)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.src='images/products/amaron_car_battery.jpg'">
          </div>
          <div class="product-body">
            <span class="product-category-tag">${escapeHTML(p.category)}</span>
            <h3 class="product-name">${escapeHTML(p.name)}</h3>
            <p class="product-desc">${escapeHTML(p.description || 'Genuine battery and electrical product available at MAA SHARADA ENTERPRISES.')}</p>
            <div class="product-price-info">
              <span class="product-price-label">Availability / Price:</span>
              <span class="product-price-val">${priceText}</span>
            </div>
            <div class="product-card-actions">
              <button type="button" class="btn-card-details" onclick="openProductDetails('${p.id}')">VIEW DETAILS</button>
              <button type="button" class="btn-card-enquire" onclick="openEnquiryForProduct('${p.id}')">BUY / ENQUIRE</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function resetAllFilters() {
    state.activeBrand = 'ALL';
    state.activeCategory = 'ALL';
    state.activeAvailability = 'ALL';
    state.searchQuery = '';

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'ALL';
    if (availabilityFilter) availabilityFilter.value = 'ALL';

    brandPillButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-brand') === 'ALL');
    });

    filterAndRenderProducts();
  }

  // 6. Setup Event Listeners
  function setupEventListeners() {
    // Header scroll background
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile nav toggle
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    if (mobileToggle && navMenu) {
      const toggleMenu = (e) => {
        if (e) e.stopPropagation();
        const isOpen = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('nav-open', isOpen);
      };

      const closeMenu = () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      };

      mobileToggle.addEventListener('click', toggleMenu);
      mobileToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu(e);
        }
      });

      if (mobileNavBackdrop) {
        mobileNavBackdrop.addEventListener('click', closeMenu);
      }

      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMenu();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          closeMenu();
        }
      });
    }

    // Live Search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterAndRenderProducts();
      });
    }

    // Category Filter
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        state.activeCategory = e.target.value;
        filterAndRenderProducts();
      });
    }

    // Availability Filter
    if (availabilityFilter) {
      availabilityFilter.addEventListener('change', (e) => {
        state.activeAvailability = e.target.value;
        filterAndRenderProducts();
      });
    }

    // Brand Pills
    brandPillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        brandPillButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeBrand = btn.getAttribute('data-brand');
        filterAndRenderProducts();
      });
    });

    // Modal Close buttons
    modalCloseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });

    // Click outside modal
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeAllModals();
        }
      });
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Click on call/WA when phone is not configured
    document.addEventListener('click', (e) => {
      const noPhoneBtn = e.target.closest('[data-no-phone="true"]');
      if (noPhoneBtn) {
        e.preventDefault();
        showToast('Helpline number is coming soon. Please submit your enquiry below!', 'info');
        openEnquiryGeneral();
      }
    });

    // Enquiry Form Submission
    if (enquiryForm) {
      enquiryForm.addEventListener('submit', handleEnquirySubmit);
    }
  }

  // 7. Modal Handlers
  window.openProductDetails = function(productId) {
    const product = state.products.find(p => String(p.id) === String(productId));
    if (!product) {
      console.warn('Product not found for id:', productId);
      return;
    }

    const modal = document.getElementById('productDetailsModal');
    const modalBody = document.getElementById('productModalBody');
    if (!modal || !modalBody) return;

    const priceText = product.price && product.price.trim() !== '' ? escapeHTML(product.price) : 'Price available on enquiry';
    const imgPath = formatImagePath(product.image);

    modalBody.innerHTML = `
      <div class="modal-product-layout">
        <div>
          <img src="${escapeHTML(imgPath)}" alt="${escapeHTML(product.name)}" class="modal-product-img" onerror="this.src='images/products/amaron_car_battery.jpg'">
        </div>
        <div class="modal-product-info">
          <span class="product-category-tag">${escapeHTML(product.category)}</span>
          <h2 class="modal-product-name">${escapeHTML(product.name)}</h2>
          <div class="modal-meta-row">
            <span class="product-brand-badge" style="position: static;">${escapeHTML(product.brand)}</span>
            <span class="service-status-pill">${escapeHTML(product.availability || 'In Stock')}</span>
          </div>
          <p class="modal-product-desc">${escapeHTML(product.description || 'Genuine battery and electrical product available at MAA SHARADA ENTERPRISES.')}</p>
          <div class="product-price-info" style="margin-bottom: 1.5rem;">
            <span class="product-price-label">Pricing:</span>
            <span class="product-price-val">${priceText}</span>
          </div>
          <button type="button" class="btn-primary" style="width: 100%;" onclick="openEnquiryForProduct('${product.id}')">
            <i class="fas fa-paper-plane"></i> BUY / ENQUIRE
          </button>
        </div>
      </div>
    `;

    openModal(modal);
  };

  window.openEnquiryForProduct = function(productId) {
    const product = state.products.find(p => String(p.id) === String(productId));
    if (!product) {
      console.warn('Product not found for id:', productId);
      return;
    }

    state.selectedProductForEnquiry = product;
    closeAllModals();

    const prodField = document.getElementById('enquiryProduct');
    const prodIdField = document.getElementById('enquiryProductId');
    if (prodField) prodField.value = `${product.brand} - ${product.name}`;
    if (prodIdField) prodIdField.value = product.id;

    const modal = document.getElementById('enquiryModal');
    openModal(modal);
  };

  window.openEnquiryForService = function(serviceTitle) {
    closeAllModals();
    const prodField = document.getElementById('enquiryProduct');
    const prodIdField = document.getElementById('enquiryProductId');
    if (prodField) prodField.value = `SERVICE: ${serviceTitle}`;
    if (prodIdField) prodIdField.value = '';

    openModal(enquiryModal);
  };

  window.openEnquiryGeneral = function(defaultTopic = 'General Product & Service Enquiry') {
    closeAllModals();
    const prodField = document.getElementById('enquiryProduct');
    const prodIdField = document.getElementById('enquiryProductId');
    if (prodField) prodField.value = defaultTopic;
    if (prodIdField) prodIdField.value = '';

    openModal(enquiryModal);
  };

  window.appEnquiry = window.openEnquiryGeneral;

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  // 8. Handle Customer Order Booking & Enquiry Submission
  async function handleEnquirySubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('enquiryName');
    const mobileInput = document.getElementById('enquiryMobile');
    const emailInput = document.getElementById('enquiryEmail');
    const addressInput = document.getElementById('enquiryAddress');
    const productInput = document.getElementById('enquiryProduct');
    const productIdInput = document.getElementById('enquiryProductId');
    const qtyInput = document.getElementById('enquiryQuantity');
    const msgInput = document.getElementById('enquiryMessage');
    const honeypotInput = document.getElementById('enquiryHoneypot');
    const submitBtn = document.getElementById('enquirySubmitBtn');

    // Validation
    const name = nameInput.value.trim();
    const rawMobile = mobileInput.value.trim();
    const mobile = rawMobile.replace(/[\s\-\(\)\+]/g, '');
    const product = productInput.value.trim();
    const quantity = parseInt(qtyInput.value, 10) || 1;

    if (!name || name.length < 2) {
      showToast('कृपया अपना पूरा नाम दर्ज करें (कम से कम 2 अक्षर)।', 'error');
      nameInput.focus();
      return;
    }

    // Indian 10-digit mobile validation
    const indianMobileRegex = /^(?:0|91)?[6789]\d{9}$/;
    if (!indianMobileRegex.test(mobile)) {
      showToast('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू)।', 'error');
      mobileInput.focus();
      return;
    }

    if (!product) {
      showToast('कृपया प्रोडक्ट या सर्विस का नाम चुनें।', 'error');
      return;
    }

    if (quantity < 1) {
      showToast('संख्या (Quantity) कम से कम 1 होनी चाहिए।', 'error');
      qtyInput.focus();
      return;
    }

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> बुकिंग सुरक्षित की जा रही है...';

    const payload = {
      customer_name: name,
      mobile: mobile.slice(-10),
      email: emailInput.value.trim(),
      address: addressInput.value.trim(),
      product_name: product,
      product_id: productIdInput.value ? parseInt(productIdInput.value, 10) : null,
      quantity: quantity,
      message: msgInput.value.trim(),
      honeypot: honeypotInput.value
    };

    try {
      const res = await fetch(API_BASE + '/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        enquiryForm.reset();
        closeAllModals();
        showSuccessModal({
          isSavedInDb: true,
          enquiryId: data.enquiryId,
          payload: payload,
          message: 'धन्यवाद! आपकी बैटरी बुकिंग सुरक्षित रूप से सर्वर डेटाबेस में दर्ज हो गई है। माँ शारदा इन्टरप्राइजेज (अरुण कुमार पटेल) आपसे जल्द संपर्क करेंगे।'
        });
      } else {
        showToast(data.message || 'बुकिंग दर्ज करने में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
      }
    } catch (err) {
      console.warn('Backend server unreachable, saving booking in local device buffer...', err);
      // Offline fallback buffer in localStorage so booking is NEVER lost
      try {
        const pending = JSON.parse(localStorage.getItem('mse_offline_bookings') || '[]');
        pending.push({ ...payload, created_at: new Date().toISOString() });
        localStorage.setItem('mse_offline_bookings', JSON.stringify(pending));
      } catch (storageErr) {}

      enquiryForm.reset();
      closeAllModals();
      showSuccessModal({
        isSavedInDb: false,
        payload: payload,
        message: 'लोकल सर्वर / डेटाबेस कनेक्ट नहीं हो सका (ऑर्डर डिवाइस में सुरक्षित है)। सप्लायर (अरुण कुमार पटेल) से तुरंत संपर्क और त्वरित डिलीवरी के लिए नीचे दिए गए WhatsApp या Call बटन का उपयोग करें!'
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }

  function showSuccessModal({ isSavedInDb, enquiryId, payload, message }) {
    const successModal = document.getElementById('successModal');
    const msgEl = document.getElementById('successModalMessage');
    const titleEl = document.getElementById('successModalTitle');
    const iconEl = document.getElementById('successModalIcon');
    const detailsEl = document.getElementById('successModalDetails');
    const waBtn = document.getElementById('successWhatsAppBtn');
    const callBtn = document.getElementById('successCallBtn');

    if (msgEl) msgEl.textContent = message;
    if (titleEl) {
      titleEl.textContent = isSavedInDb 
        ? 'Booking Saved Successfully (डेटाबेस में सुरक्षित)' 
        : 'Local Server Offline (ऑर्डर बफर में सुरक्षित)';
    }

    if (iconEl) {
      if (isSavedInDb) {
        iconEl.innerHTML = '<i class="fas fa-check"></i>';
        iconEl.style.background = 'var(--amaron-green-bg)';
        iconEl.style.color = 'var(--amaron-green)';
      } else {
        iconEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        iconEl.style.background = 'rgba(245, 158, 11, 0.15)';
        iconEl.style.color = '#F59E0B';
      }
    }

    if (detailsEl && payload) {
      detailsEl.style.display = 'block';
      detailsEl.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.4rem; color: var(--text-heading); border-bottom: 1px dashed var(--border-color); padding-bottom: 0.3rem;">
          ${isSavedInDb ? `✅ Order ID: #${enquiryId || 'NEW'}` : '⚠️ Offline Buffered Order (सर्वर ऑफलाइन)'}
        </div>
        <div style="margin-top: 0.3rem;"><strong>Customer:</strong> ${escapeHTML(payload.customer_name)} (<a href="tel:${escapeHTML(payload.mobile)}" style="color: var(--amaron-green); font-weight: 700;">${escapeHTML(payload.mobile)}</a>)</div>
        <div><strong>Item:</strong> ${escapeHTML(payload.product_name)} (मात्रा: ${payload.quantity || 1})</div>
        ${payload.address ? `<div><strong>Address:</strong> ${escapeHTML(payload.address)}</div>` : ''}
        ${payload.message ? `<div><strong>Requirement:</strong> ${escapeHTML(payload.message)}</div>` : ''}
      `;
    }

    // Configure Direct WhatsApp Button to Shop Owner (Arun Patel)
    if (waBtn && payload) {
      const shopPhone = (state.settings.SHOP_PHONE_NUMBER || '+91 63868 50612').replace(/[^0-9]/g, '');
      const targetPhone = shopPhone.length === 10 ? `91${shopPhone}` : shopPhone;
      const waText = `नमस्ते माँ शारदा इन्टरप्राइजेज (अरुण पटेल जी),\nमैंने वेबसाइट पर बैटरी/उत्पाद बुकिंग दर्ज की है:\n\n👤 *ग्राहक:* ${payload.customer_name}\n📞 *मोबाइल:* ${payload.mobile}\n🔋 *प्रोडक्ट:* ${payload.product_name}\n🔢 *मात्रा:* ${payload.quantity || 1}\n📍 *पता:* ${payload.address || 'शॉप से संपर्क'}\n📝 *नोट:* ${payload.message || 'लागू नहीं'}\n${isSavedInDb ? `🆔 *ऑर्डर आईडी:* #${enquiryId}` : '⚠️ *स्टेटस:* ऑफलाइन ऑर्डर'}\n\nकृपया जल्द संपर्क करके कन्फर्म करें।`;
      waBtn.href = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;
      waBtn.style.display = 'inline-flex';
    }

    // Configure Call Button
    if (callBtn) {
      const activePhone = (state.settings.SHOP_PHONE_NUMBER || '+91 63868 50612').replace(/[\s\-]/g, '');
      callBtn.href = `tel:${activePhone}`;
    }

    openModal(successModal);
  }

  // 9. Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'error') icon = 'fas fa-exclamation-circle';

    toast.innerHTML = `
      <i class="${icon}" style="font-size: 1.1rem; margin-top: 2px;"></i>
      <div style="flex-grow: 1;">${escapeHTML(message)}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.showToast = showToast;
});
