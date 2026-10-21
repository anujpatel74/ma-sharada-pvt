import { jsonResponse } from '../../data.js';

export async function onRequestPost(context) {
  try {
    const { slideIds } = await context.request.json();
    if (!Array.isArray(slideIds)) {
      return jsonResponse({ success: false, message: 'Invalid payload.' }, 400);
    }

    if (context.env.DB) {
      for (let order = 0; order < slideIds.length; order++) {
        await context.env.DB.prepare(
          'UPDATE slider_slides SET display_order = ? WHERE id = ?'
        ).bind(order + 1, slideIds[order]).run();
      }
    }

    return jsonResponse({ success: true, message: 'Slides reordered successfully.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to reorder slides: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
