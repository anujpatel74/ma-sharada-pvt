import { defaultProducts, jsonResponse } from '../data.js';

export async function onRequestGet(context) {
  const id = context.params.id;

  try {
    if (context.env.DB) {
      const row = await context.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
      if (!row) {
        return jsonResponse({ success: false, message: 'Product not found.' }, 404);
      }
      return jsonResponse({ success: true, data: row });
    }
  } catch (err) {
    console.warn('D1 query error:', err.message);
  }

  const found = defaultProducts.find(p => String(p.id) === String(id));
  if (!found) {
    return jsonResponse({ success: false, message: 'Product not found.' }, 404);
  }
  return jsonResponse({ success: true, data: found });
}

export async function onRequestPut(context) {
  const id = context.params.id;
  try {
    const body = await context.request.json();
    const { name, brand, category, description, image, price, availability, is_featured } = body;

    if (context.env.DB) {
      const sql = `UPDATE products SET 
                     name = COALESCE(?, name),
                     brand = COALESCE(?, brand),
                     category = COALESCE(?, category),
                     description = COALESCE(?, description),
                     image = COALESCE(?, image),
                     price = COALESCE(?, price),
                     availability = COALESCE(?, availability),
                     is_featured = COALESCE(?, is_featured)
                   WHERE id = ?`;
      await context.env.DB.prepare(sql).bind(
        name, brand, category, description, image, price, availability, is_featured, id
      ).run();
    }

    return jsonResponse({ success: true, message: 'Product updated successfully.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to update product: ' + err.message }, 500);
  }
}

export async function onRequestDelete(context) {
  const id = context.params.id;
  try {
    if (context.env.DB) {
      await context.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    }
    return jsonResponse({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Failed to delete product: ' + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
