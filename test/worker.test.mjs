import worker from '../worker.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// Mock ASSETS binding to simulate Cloudflare's static asset fetch
const mockAssets = {
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = path.join(publicDir, url.pathname);
    if (url.pathname === '/' || url.pathname === '') {
      filePath = path.join(publicDir, 'index.html');
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime = ext === '.html' ? 'text/html' : (ext === '.css' ? 'text/css' : (ext === '.js' ? 'application/javascript' : 'application/octet-stream'));
      return new Response(fs.readFileSync(filePath), {
        status: 200,
        headers: { 'Content-Type': mime }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
};

const mockEnv = {
  ASSETS: mockAssets,
  JWT_SECRET: 'test_jwt_secret_key_12345',
  ADMIN_EMAIL: 'admin@maasharada.com',
  ADMIN_PASSWORD: 'MaaSharada@2026',
  SHOP_PHONE_NUMBER: '+91 63868 50612',
  SHOP_EMAIL: 'contact@maasharada.com'
};

async function runTests() {
  console.log('--- Starting Cloudflare Worker API & Asset Integration Tests ---');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${name} ->`, e.message);
    }
  }

  // 1. Health check
  await test('GET /api/health', async () => {
    const req = new Request('http://localhost/api/health');
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'ok') throw new Error(`Status ${res.status}`);
  });

  // 2. Settings
  await test('GET /api/settings', async () => {
    const req = new Request('http://localhost/api/settings');
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (!data.success || data.data.SHOP_NAME !== 'MAA SHARADA ENTERPRISES') throw new Error('Invalid settings');
  });

  // 3. Services (all 13 services)
  await test('GET /api/services returns 13 services', async () => {
    const req = new Request('http://localhost/api/services');
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (!data.success || data.count !== 13) throw new Error(`Expected 13 services, got ${data.count}`);
  });

  // 4. Products (18 products + Amaron filter)
  await test('GET /api/products returns products catalogue and filters correctly', async () => {
    const reqAll = new Request('http://localhost/api/products');
    const resAll = await worker.fetch(reqAll, mockEnv);
    const dataAll = await resAll.json();
    if (!dataAll.success || dataAll.count < 18) throw new Error(`Expected at least 18 products, got ${dataAll.count}`);

    const reqAmaron = new Request('http://localhost/api/products?brand=AMARON');
    const resAmaron = await worker.fetch(reqAmaron, mockEnv);
    const dataAmaron = await resAmaron.json();
    if (!dataAmaron.success || dataAmaron.data.some(p => p.brand !== 'AMARON')) throw new Error('Filter failed');
  });

  // 5. Slides
  await test('GET /api/slides returns 4 active homepage slides', async () => {
    const req = new Request('http://localhost/api/slides');
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (!data.success || data.count !== 4) throw new Error(`Expected 4 slides, got ${data.count}`);
  });

  // 6. Enquiry Submission
  await test('POST /api/enquiries validates and accepts booking', async () => {
    const req = new Request('http://localhost/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Anil Kumar',
        mobile: '9876543210',
        product_name: 'Amaron Pro Rider 5L Two-Wheeler Battery',
        quantity: 1,
        message: 'Need urgent delivery'
      })
    });
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (res.status !== 201 || !data.success) throw new Error(`Failed to submit enquiry: ${JSON.stringify(data)}`);
  });

  // 7. Admin Login & JWT Authentication
  let authToken = '';
  await test('POST /api/admin/login authenticates with valid credentials', async () => {
    const req = new Request('http://localhost/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@maasharada.com',
        password: 'MaaSharada@2026'
      })
    });
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (res.status !== 200 || !data.token) throw new Error('Login failed');
    authToken = data.token;
  });

  // 8. Protected route: GET /api/admin/me
  await test('GET /api/admin/me validates JWT token', async () => {
    const req = new Request('http://localhost/api/admin/me', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (res.status !== 200 || !data.success) throw new Error('Auth validation failed');
  });

  // 9. Protected route: GET /api/dashboard/stats
  await test('GET /api/dashboard/stats returns KPI metrics', async () => {
    const req = new Request('http://localhost/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const res = await worker.fetch(req, mockEnv);
    const data = await res.json();
    if (res.status !== 200 || !data.data || data.data.totalProducts < 18) throw new Error('Stats failed');
  });

  // 10. Admin URL routing: GET /admin
  await test('GET /admin serves admin console HTML', async () => {
    const req = new Request('http://localhost/admin');
    const res = await worker.fetch(req, mockEnv);
    const text = await res.text();
    if (res.status !== 200 || !text.includes('Admin Console')) throw new Error('Admin HTML failed');
  });

  // 11. Customer URL routing: GET /
  await test('GET / serves storefront HTML', async () => {
    const req = new Request('http://localhost/');
    const res = await worker.fetch(req, mockEnv);
    const text = await res.text();
    if (res.status !== 200 || !text.includes('MAA SHARADA ENTERPRISES')) throw new Error('Storefront HTML failed');
  });

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
