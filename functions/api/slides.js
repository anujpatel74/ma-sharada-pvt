import { defaultSlides, jsonResponse } from './data.js';

export async function onRequestGet(context) {
  try {
    if (context.env.DB) {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM slider_slides WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
      ).all();
      return jsonResponse({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (err) {
    console.warn('D1 query error for slides, falling back:', err.message);
  }

  const activeSlides = defaultSlides.filter(s => s.is_active === 1);
  return jsonResponse({
    success: true,
    count: activeSlides.length,
    data: activeSlides
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
