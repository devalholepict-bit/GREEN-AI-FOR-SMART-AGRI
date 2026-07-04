const express = require('express');
const router = express.Router();
const {
  farmerRegister,
  farmerLogin,
  customerRegister,
  customerLogin,
  adminLogin
} = require('../controllers/authController');

// Farmer auth routes
router.post('/farmer/register', farmerRegister);
router.post('/farmer/login', farmerLogin);

// Customer auth routes
router.post('/customer/register', customerRegister);
router.post('/customer/login', customerLogin);

// Admin auth routes
router.post('/admin/login', adminLogin);

module.exports = router;
