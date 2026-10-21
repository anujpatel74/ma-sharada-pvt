import { jsonResponse } from './data.js';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { customer_name, mobile, email, address, product_id, product_name, quantity, message } = body;

    if (!customer_name || !mobile) {
      return jsonResponse({ success: false, message: 'Name and mobile number are required.' }, 400);
    }

    let enquiryId = Date.now();

    if (context.env.DB) {
      const sql = `INSERT INTO enquiries (customer_name, mobile, email, address, product_id, product_name, quantity, message, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'NEW')`;
      const result = await context.env.DB.prepare(sql).bind(
        customer_name,
        mobile,
        email || null,
        address || null,
        product_id || null,
        product_name || 'General Enquiry',
        quantity || 1,
        message || null
      ).run();
      enquiryId = result.meta.last_row_id;
    }

    return jsonResponse({
      success: true,
      enquiryId,
      message: 'Thank you! Your booking/order has been recorded successfully. MAA SHARADA ENTERPRISES will contact you soon.'
    }, 201);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Error submitting enquiry: ' + err.message }, 500);
  }
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  try {
    if (context.env.DB) {
      let sql = 'SELECT * FROM enquiries WHERE 1=1';
      const params = [];

      if (status && status !== 'ALL') {
        sql += ' AND status = ?';
        params.push(status);
      }

      if (search && search.trim() !== '') {
        sql += ' AND (customer_name LIKE ? OR mobile LIKE ? OR product_name LIKE ? OR address LIKE ?)';
        const term = `%${search.trim()}%`;
        params.push(term, term, term, term);
      }

      sql += ' ORDER BY created_at DESC';

      const { results } = await context.env.DB.prepare(sql).bind(...params).all();
      return jsonResponse({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (err) {
    console.warn('D1 enquiries query error:', err.message);
  }

  return jsonResponse({
    success: true,
    count: 0,
    data: []
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
