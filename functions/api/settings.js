import { defaultSettings, jsonResponse } from './data.js';

export async function onRequestGet(context) {
  const settingsObj = { ...defaultSettings };

  try {
    if (context.env.DB) {
      const { results } = await context.env.DB.prepare('SELECT key, value FROM settings').all();
      results.forEach(r => {
        if (r.key) settingsObj[r.key] = r.value || '';
      });
    }
  } catch (err) {
    console.warn('D1 query error for settings, falling back:', err.message);
  }

  // Also check environment variables in context.env
  if (context.env.SHOP_PHONE_NUMBER) settingsObj.SHOP_PHONE_NUMBER = context.env.SHOP_PHONE_NUMBER;
  if (context.env.SHOP_EMAIL) settingsObj.SHOP_EMAIL = context.env.SHOP_EMAIL;

  return jsonResponse({
    success: true,
    data: settingsObj
  });
}

export async function onRequestPut(context) {
  try {
    const updates = await context.request.json();
    if (!updates || typeof updates !== 'object') {
      return jsonResponse({ success: false, message: 'Invalid payload.' }, 400);
    }

    if (context.env.DB) {
      const allowedKeys = ['SHOP_PHONE_NUMBER', 'SHOP_EMAIL', 'SHOP_ADDRESS', 'SHOP_OWNER', 'SHOP_TAGLINE', 'MAPS_QUERY'];
      for (const [key, val] of Object.entries(updates)) {
        if (allowedKeys.includes(key)) {
          await context.env.DB.prepare(
            'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
          ).bind(key, (val || '').trim()).run();
        }
      }
    }

    return jsonResponse({
      success: true,
      message: 'Shop settings updated successfully.'
    });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to update settings: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
