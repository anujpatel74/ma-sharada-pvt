const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let cloudinary;

try {
  cloudinary = require('cloudinary').v2;
} catch (e) {
  cloudinary = null;
}

// Check if Cloudinary credentials are provided via environment variables
function isCloudinaryConfigured() {
  if (!cloudinary) return false;
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim() !== '') {
    return true;
  }
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME.trim() !== '' &&
    process.env.CLOUDINARY_API_KEY.trim() !== '' &&
    process.env.CLOUDINARY_API_SECRET.trim() !== ''
  );
}

// Initialize Cloudinary if credentials exist
if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL.trim()
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
      api_key: process.env.CLOUDINARY_API_KEY.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
      secure: true
    });
  }
  console.log('☁️ Persistent Cloud Storage: Cloudinary initialized successfully.');
} else {
  console.log('📁 Storage: Local filesystem storage active. (Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET for cloud persistence).');
}

// Local uploads directory (configured via UPLOADS_PATH or public/uploads/slider)
const defaultUploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'slider');
const rawUploadsDir = process.env.UPLOADS_PATH && process.env.UPLOADS_PATH.trim()
  ? process.env.UPLOADS_PATH.trim()
  : defaultUploadsDir;

const uploadsDir = path.isAbsolute(rawUploadsDir)
  ? rawUploadsDir
  : path.resolve(process.cwd(), rawUploadsDir);

// Ensure local directory exists
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create local uploads directory:', err.message);
  }
}

/**
 * Validate image buffer using magic bytes to prevent spoofed file extensions
 */
function isValidImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG magic bytes: FF D8 FF
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

  // PNG magic bytes: 89 50 4E 47
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;

  // WebP magic bytes: RIFF....WEBP
  const isWebp =
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer.toString('ascii', 8, 12) === 'WEBP';

  return isJpeg || isPng || isWebp;
}

/**
 * Get standard file extension from mimetype or buffer
 */
function getExtension(mimetype, buffer) {
  if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') return 'jpg';
  if (mimetype === 'image/png') return 'png';
  if (mimetype === 'image/webp') return 'webp';

  // Fallback to inspecting buffer magic bytes
  if (buffer) {
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'jpg';
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'png';
    if (buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  }
  return 'jpg';
}

/**
 * Upload an image buffer to Cloudinary or local disk
 */
async function uploadImage({ buffer, originalname, mimetype }) {
  if (!isValidImageBuffer(buffer)) {
    throw new Error('Invalid image file format. Only authentic JPEG, PNG, and WebP images are allowed.');
  }

  // If Cloudinary is configured, upload to cloud
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'maa-sharada/slider',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error('Cloud storage upload failed: ' + error.message));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            storageType: 'cloudinary',
            width: result.width,
            height: result.height,
            format: result.format
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Otherwise, fallback to persistent local / Railway volume disk
  const ext = getExtension(mimetype, buffer);
  const safeFilename = `slide_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.${ext}`;
  const targetPath = path.join(uploadsDir, safeFilename);

  fs.writeFileSync(targetPath, buffer);

  // Return static URL accessible from browser
  const publicUrl = `/uploads/slider/${safeFilename}`;

  return {
    url: publicUrl,
    publicId: safeFilename,
    storageType: 'local'
  };
}

/**
 * Safely delete an image from Cloudinary or local disk
 */
async function deleteImage(imageUrl, publicId, storageType) {
  try {
    if (storageType === 'cloudinary' || (publicId && publicId.includes('maa-sharada/'))) {
      if (isCloudinaryConfigured() && publicId) {
        await cloudinary.uploader.destroy(publicId);
        console.log('Deleted Cloudinary asset:', publicId);
      }
      return;
    }

    // Local file deletion
    const filename = publicId || (imageUrl ? path.basename(imageUrl) : null);
    if (!filename) return;

    // Do not delete default hero stock images in public/images/hero/
    if (imageUrl && imageUrl.includes('/images/hero/')) {
      return;
    }

    // Prevent path traversal
    const safeName = path.basename(filename);
    const targetPath = path.join(uploadsDir, safeName);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      console.log('Deleted local upload file:', targetPath);
    }
  } catch (err) {
    console.warn('Error during image deletion (non-fatal):', err.message);
  }
}

/**
 * Get current storage health & configuration status
 */
function getStorageStatus() {
  const isCloud = isCloudinaryConfigured();
  return {
    provider: isCloud ? 'cloudinary' : 'local',
    isPersistent: isCloud || Boolean(process.env.UPLOADS_PATH),
    cloudConfigured: isCloud,
    uploadsDir: uploadsDir,
    message: isCloud
      ? 'Cloudinary Persistent Cloud Storage is active. All slide uploads are stored permanently in the cloud.'
      : 'Local server storage is active. For permanent zero-maintenance cloud storage on Railway, configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.'
  };
}

function getUploadsDir() {
  return uploadsDir;
}

module.exports = {
  uploadImage,
  deleteImage,
  getStorageStatus,
  getUploadsDir,
  isValidImageBuffer,
  isCloudinaryConfigured
};
