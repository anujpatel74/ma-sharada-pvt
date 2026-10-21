import { jsonResponse } from '../data.js';

export async function onRequestPut(context) {
  const id = context.params.id;
  try {
    const body = await context.request.json();
    const { status } = body;

    if (context.env.DB && status) {
      await context.env.DB.prepare('UPDATE enquiries SET status = ? WHERE id = ?').bind(status, id).run();
    }

    return jsonResponse({
      success: true,
      message: 'Booking status updated successfully.'
    });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to update enquiry: ' + err.message }, 500);
  }
}

export async function onRequestPatch(context) {
  return onRequestPut(context);
}

export async function onRequestDelete(context) {
  const id = context.params.id;
  try {
    if (context.env.DB) {
      await context.env.DB.prepare('DELETE FROM enquiries WHERE id = ?').bind(id).run();
    }
    return jsonResponse({
      success: true,
      message: 'Enquiry deleted successfully.'
    });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to delete enquiry: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
