function validateEnquiry(req, res, next) {
  const { customer_name, mobile, product_name, quantity, honeypot } = req.body;

  // Spam bot protection
  if (honeypot) {
    return res.status(400).json({ success: false, message: 'Spam submission detected.' });
  }

  // Name validation
  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your full name (at least 2 characters).'
    });
  }

  // Mobile number validation (Indian 10-digit mobile number)
  if (!mobile || typeof mobile !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Mobile number is required.'
    });
  }

  const cleanedMobile = mobile.replace(/[\s\-\(\)\+]/g, '');
  // Allows 10 digits starting with 6,7,8,9 or with leading 91/0
  const indianMobileRegex = /^(?:0|91)?[6789]\d{9}$/;
  if (!indianMobileRegex.test(cleanedMobile)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).'
    });
  }

  // Product validation
  if (!product_name || typeof product_name !== 'string' || product_name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please select a product or service for enquiry.'
    });
  }

  // Quantity validation
  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 500) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a valid number between 1 and 500.'
    });
  }

  // Clean values on request
  req.body.customer_name = customer_name.trim();
  req.body.mobile = cleanedMobile.slice(-10); // Standardize to 10 digits
  if (req.body.email) req.body.email = req.body.email.trim();
  if (req.body.address) req.body.address = req.body.address.trim();
  if (req.body.message) req.body.message = req.body.message.trim();
  req.body.quantity = parsedQty;

  next();
}

module.exports = { validateEnquiry };
