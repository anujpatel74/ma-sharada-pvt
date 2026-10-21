import { jsonResponse } from '../../data.js';

export async function onRequestGet(context) {
  const isCloudinaryConfigured = Boolean(
    context.env.CLOUDINARY_CLOUD_NAME &&
    context.env.CLOUDINARY_API_KEY &&
    context.env.CLOUDINARY_API_SECRET
  );

  return jsonResponse({
    success: true,
    data: {
      isCloudConfigured: isCloudinaryConfigured,
      cloudProvider: isCloudinaryConfigured ? 'Cloudinary' : null,
      storageType: isCloudinaryConfigured ? 'cloud' : 'cloudflare_edge',
      activeLocation: isCloudinaryConfigured
        ? `Cloudinary (${context.env.CLOUDINARY_CLOUD_NAME})`
        : 'Cloudflare Pages CDN',
      notice: isCloudinaryConfigured
        ? 'Slider uploads stream to Cloudinary permanently.'
        : 'Running on Cloudflare Pages. Uploaded images are served via Cloudflare edge.'
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
