import { jsonResponse } from './data.js';

export async function onRequestGet() {
  return jsonResponse({
    status: 'ok',
    business: 'MAA SHARADA ENTERPRISES',
    platform: 'Cloudflare Pages Edge',
    time: new Date().toISOString()
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
