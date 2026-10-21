import { defaultSlides, jsonResponse } from '../data.js';

export async function onRequestGet(context) {
  try {
    if (context.env.DB) {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM slider_slides ORDER BY display_order ASC, id ASC'
      ).all();
      return jsonResponse({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (err) {
    console.warn('D1 query error:', err.message);
  }

  return jsonResponse({
    success: true,
    count: defaultSlides.length,
    data: defaultSlides
  });
}

export async function onRequestPost(context) {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    let body = {};

    if (contentType.includes('application/json')) {
      body = await context.request.json();
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await context.request.formData();
      formData.forEach((val, key) => {
        if (typeof val === 'string') body[key] = val;
      });
    }

    const {
      title, subtitle, badge_text, badge_icon, badge_color,
      button_text, button_link, secondary_button_text, secondary_button_link,
      image_url, display_order, is_active
    } = body;

    if (!title) {
      return jsonResponse({ success: false, message: 'Slide title is required.' }, 400);
    }

    if (context.env.DB) {
      const sql = `INSERT INTO slider_slides 
        (title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, secondary_button_text, secondary_button_link, image_url, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const result = await context.env.DB.prepare(sql).bind(
        title,
        subtitle || '',
        badge_text || '',
        badge_icon || 'fas fa-bolt',
        badge_color || 'default',
        button_text || 'Explore Products',
        button_link || '#products',
        secondary_button_text || '',
        secondary_button_link || '',
        image_url || 'images/hero/slider_battery_inverter.png',
        display_order ? parseInt(display_order, 10) : 0,
        is_active === '0' || is_active === false ? 0 : 1
      ).run();

      return jsonResponse({
        success: true,
        message: 'Slide added successfully.',
        slideId: result.meta.last_row_id
      }, 201);
    }

    return jsonResponse({
      success: true,
      message: 'Slide added successfully (Cloudflare session mode).',
      slideId: Date.now()
    }, 201);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to create slide: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
