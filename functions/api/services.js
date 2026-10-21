import { defaultServices, jsonResponse } from './data.js';

export async function onRequestGet(context) {
  try {
    if (context.env.DB) {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM services ORDER BY id ASC'
      ).all();
      return jsonResponse({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (err) {
    console.warn('D1 query error for services, falling back:', err.message);
  }

  return jsonResponse({
    success: true,
    count: defaultServices.length,
    data: defaultServices
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
