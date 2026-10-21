import { jsonResponse } from '../../data.js';

export async function onRequestPut(context) {
  const id = context.params.id;
  try {
    const body = await context.request.json();
    const { title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, is_active } = body;

    if (context.env.DB) {
      const sql = `UPDATE slider_slides SET
                     title = COALESCE(?, title),
                     subtitle = COALESCE(?, subtitle),
                     badge_text = COALESCE(?, badge_text),
                     badge_icon = COALESCE(?, badge_icon),
                     badge_color = COALESCE(?, badge_color),
                     button_text = COALESCE(?, button_text),
                     button_link = COALESCE(?, button_link),
                     is_active = COALESCE(?, is_active),
                     updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?`;
      await context.env.DB.prepare(sql).bind(
        title, subtitle, badge_text, badge_icon, badge_color, button_text, button_link, is_active, id
      ).run();
    }

    return jsonResponse({ success: true, message: 'Slide updated successfully.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to update slide: ' + err.message }, 500);
  }
}

export async function onRequestPatch(context) {
  return onRequestPut(context);
}

export async function onRequestDelete(context) {
  const id = context.params.id;
  try {
    if (context.env.DB) {
      await context.env.DB.prepare('DELETE FROM slider_slides WHERE id = ?').bind(id).run();
    }
    return jsonResponse({ success: true, message: 'Slide deleted successfully.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to delete slide: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
