import { defaultProducts, defaultSlides, jsonResponse } from '../data.js';

export async function onRequestGet(context) {
  try {
    if (context.env.DB) {
      const totalProductsRow = await context.env.DB.prepare('SELECT COUNT(*) as count FROM products').first();
      const inStockRow = await context.env.DB.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'In Stock'").first();
      const totalEnquiriesRow = await context.env.DB.prepare('SELECT COUNT(*) as count FROM enquiries').first();
      const newEnquiriesRow = await context.env.DB.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'NEW'").first();
      const contactedRow = await context.env.DB.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'CONTACTED'").first();
      const completedRow = await context.env.DB.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'COMPLETED'").first();
      const totalSlidesRow = await context.env.DB.prepare('SELECT COUNT(*) as count FROM slider_slides').first();
      const activeSlidesRow = await context.env.DB.prepare('SELECT COUNT(*) as count FROM slider_slides WHERE is_active = 1').first();

      return jsonResponse({
        success: true,
        data: {
          totalProducts: totalProductsRow ? totalProductsRow.count : 0,
          inStockProducts: inStockRow ? inStockRow.count : 0,
          totalEnquiries: totalEnquiriesRow ? totalEnquiriesRow.count : 0,
          newEnquiries: newEnquiriesRow ? newEnquiriesRow.count : 0,
          contactedEnquiries: contactedRow ? contactedRow.count : 0,
          completedEnquiries: completedRow ? completedRow.count : 0,
          totalSlides: totalSlidesRow ? totalSlidesRow.count : 0,
          activeSlides: activeSlidesRow ? activeSlidesRow.count : 0
        }
      });
    }
  } catch (err) {
    console.warn('D1 stats query error:', err.message);
  }

  return jsonResponse({
    success: true,
    data: {
      totalProducts: defaultProducts.length,
      inStockProducts: defaultProducts.filter(p => p.availability === 'In Stock').length,
      totalEnquiries: 0,
      newEnquiries: 0,
      contactedEnquiries: 0,
      completedEnquiries: 0,
      totalSlides: defaultSlides.length,
      activeSlides: defaultSlides.filter(s => s.is_active === 1).length
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
