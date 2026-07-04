const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ========================
// FARMER AUTH
// ========================

// @desc    Register a new farmer
// @route   POST /api/auth/farmer/register
const farmerRegister = async (req, res) => {
  try {
    const { farmer_name, email, password, phone_no, gender, birthday, state, district, location } = req.body;

    // Check if farmer already exists
    const farmerExists = await Farmer.findOne({ email });
    if (farmerExists) {
      return res.status(400).json({ success: false, message: 'Farmer with this email already exists' });
    }

    // Create farmer
    const farmer = await Farmer.create({
      farmer_name,
      email,
      password,
      phone_no,
      gender,
      birthday,
      state,
      district,
      location
    });

    const token = generateToken(farmer._id, 'farmer');

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      token,
      farmer: {
        _id: farmer._id,
        farmer_name: farmer.farmer_name,
        email: farmer.email,
        phone_no: farmer.phone_no,
        gender: farmer.gender,
        birthday: farmer.birthday,
        state: farmer.state,
        district: farmer.district,
        location: farmer.location
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login farmer
// @route   POST /api/auth/farmer/login
const farmerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find farmer by email
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await farmer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(farmer._id, 'farmer');

    res.json({
      success: true,
      message: 'Farmer logged in successfully',
      token,
      farmer: {
        _id: farmer._id,
        farmer_name: farmer.farmer_name,
        email: farmer.email,
        phone_no: farmer.phone_no,
        gender: farmer.gender,
        birthday: farmer.birthday,
        state: farmer.state,
        district: farmer.district,
        location: farmer.location
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// CUSTOMER AUTH
// ========================

// @desc    Register a new customer
// @route   POST /api/auth/customer/register
const customerRegister = async (req, res) => {
  try {
    const { cust_name, email, password, phone_no, address, city, pincode, state } = req.body;

    // Check if customer already exists
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res.status(400).json({ success: false, message: 'Customer with this email already exists' });
    }

    // Create customer
    const customer = await Customer.create({
      cust_name,
      email,
      password,
      phone_no,
      address,
      city,
      pincode,
      state
    });

    const token = generateToken(customer._id, 'customer');

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      token,
      customer: {
        _id: customer._id,
        cust_name: customer.cust_name,
        email: customer.email,
        phone_no: customer.phone_no,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
        state: customer.state
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login customer
// @route   POST /api/auth/customer/login
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(customer._id, 'customer');

    res.json({
      success: true,
      message: 'Customer logged in successfully',
      token,
      customer: {
        _id: customer._id,
        cust_name: customer.cust_name,
        email: customer.email,
        phone_no: customer.phone_no,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
        state: customer.state
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// ADMIN AUTH
// ========================

// @desc    Login admin
// @route   POST /api/auth/admin/login
const adminLogin = async (req, res) => {
  try {
    const { admin_name, password } = req.body;

    // Find admin by name
    const admin = await Admin.findOne({ admin_name });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin name or password' });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin name or password' });
    }

    const token = generateToken(admin._id, 'admin');

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      admin: {
        _id: admin._id,
        admin_name: admin.admin_name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  farmerRegister,
  farmerLogin,
  customerRegister,
  customerLogin,
  adminLogin
};
