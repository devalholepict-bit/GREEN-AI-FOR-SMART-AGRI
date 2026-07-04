const express = require('express');
const router = express.Router();
const { protect, customerOnly } = require('../middleware/authMiddleware');
const {
  getCustomerProfile,
  updateCustomerProfile,
  getMarketplace,
  addToCart,
  customerCheckout
} = require('../controllers/customerController');

// All routes protected by JWT + customer role
router.use(protect, customerOnly);

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);
router.get('/marketplace', getMarketplace);
router.post('/cart', addToCart);
router.post('/checkout', customerCheckout);

module.exports = router;
