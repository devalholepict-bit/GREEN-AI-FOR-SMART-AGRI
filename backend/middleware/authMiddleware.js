const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

// Generic JWT verification
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Farmer-only middleware
const farmerOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'farmer') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Farmers only.' });
};

// Customer-only middleware
const customerOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Customers only.' });
};

// Admin-only middleware
const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
};

module.exports = { protect, farmerOnly, customerOnly, adminOnly };
