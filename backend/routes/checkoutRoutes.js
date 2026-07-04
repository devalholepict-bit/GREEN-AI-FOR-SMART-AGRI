const express = require('express');
const router = express.Router();
const { protect, customerOnly } = require('../middleware/authMiddleware');
const {
  createCheckoutSession,
  paymentSuccess
} = require('../controllers/checkoutController');

// Checkout routes - protected for customers
router.post('/create-session', protect, customerOnly, createCheckoutSession);
router.post('/payment-success', protect, customerOnly, paymentSuccess);

module.exports = router;
