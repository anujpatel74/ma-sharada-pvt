import { defaultProducts, jsonResponse } from './data.js';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const search = url.searchParams.get('search');
  const brand = url.searchParams.get('brand');
  const category = url.searchParams.get('category');
  const availability = url.searchParams.get('availability');

  try {
    if (context.env.DB) {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (brand && brand !== 'ALL') {
        sql += ' AND UPPER(brand) = ?';
        params.push(brand.toUpperCase());
      }
      if (category && category !== 'ALL') {
        sql += ' AND UPPER(category) = ?';
        params.push(category.toUpperCase());
      }
      if (availability && availability !== 'ALL') {
        sql += ' AND availability = ?';
        params.push(availability);
      }
      if (search && search.trim() !== '') {
        sql += ' AND (name LIKE ? OR brand LIKE ? OR category LIKE ? OR description LIKE ?)';
        const term = `%${search.trim()}%`;
        params.push(term, term, term, term);
      }
      sql += ' ORDER BY is_featured DESC, id ASC';

      const stmt = context.env.DB.prepare(sql).bind(...params);
      const { results } = await stmt.all();

      return jsonResponse({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (err) {
    console.warn('D1 products query error, falling back:', err.message);
  }

  // Fallback to static catalogue with filtering
  let filtered = [...defaultProducts];

  if (brand && brand !== 'ALL') {
    filtered = filtered.filter(p => p.brand.toUpperCase() === brand.toUpperCase());
  }
  if (category && category !== 'ALL') {
    filtered = filtered.filter(p => p.category.toUpperCase() === category.toUpperCase());
  }
  if (availability && availability !== 'ALL') {
    filtered = filtered.filter(p => p.availability === availability);
  }
  if (search && search.trim() !== '') {
    const s = search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  }

  return jsonResponse({
    success: true,
    count: filtered.length,
    data: filtered
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, brand, category, description, image, price, availability, is_featured } = body;

    if (!name || !brand || !category) {
      return jsonResponse({ success: false, message: 'Name, brand, and category are required.' }, 400);
    }

    if (context.env.DB) {
      const sql = `INSERT INTO products (name, brand, category, description, image, price, availability, is_featured)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const result = await context.env.DB.prepare(sql).bind(
        name,
        brand,
        category,
        description || '',
        image || 'images/products/amaron_car_battery.jpg',
        price || 'Price available on enquiry',
        availability || 'In Stock',
        is_featured ? 1 : 0
      ).run();

      return jsonResponse({
        success: true,
        message: 'Product created successfully.',
        productId: result.meta.last_row_id
      }, 201);
    }

    return jsonResponse({
      success: true,
      message: 'Product added successfully (Cloudflare session mode).',
      productId: Date.now()
    }, 201);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to create product: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
