import { jsonResponse } from '../data.js';

export async function onRequestGet(context) {
  const authHeader = context.request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return jsonResponse({ success: false, message: 'Authentication required.' }, 401);
  }

  return jsonResponse({
    success: true,
    admin: {
      id: 1,
      email: context.env.ADMIN_EMAIL || 'admin@maasharada.com',
      name: 'Admin Arun Patel'
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
