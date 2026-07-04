const Customer = require('../models/Customer');
const CropTrade = require('../models/CropTrade');

// @desc    Get customer profile
// @route   GET /api/customer/profile
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile
const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { cust_name, phone_no, address, city, pincode, state } = req.body;

    if (cust_name) customer.cust_name = cust_name;
    if (phone_no) customer.phone_no = phone_no;
    if (address !== undefined) customer.address = address;
    if (city !== undefined) customer.city = city;
    if (pincode !== undefined) customer.pincode = pincode;
    if (state !== undefined) customer.state = state;

    const updatedCustomer = await customer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      customer: {
        _id: updatedCustomer._id,
        cust_name: updatedCustomer.cust_name,
        email: updatedCustomer.email,
        phone_no: updatedCustomer.phone_no,
        address: updatedCustomer.address,
        city: updatedCustomer.city,
        pincode: updatedCustomer.pincode,
        state: updatedCustomer.state
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all available crops (marketplace)
// @route   GET /api/customer/marketplace
const getMarketplace = async (req, res) => {
  try {
    const crops = await CropTrade.find({ quantity: { $gt: 0 } })
      .populate('farmer_id', 'farmer_name state district location')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add to cart (session-based, returns cart info)
// @route   POST /api/customer/cart
const addToCart = async (req, res) => {
  try {
    const { trade_id, quantity } = req.body;

    const trade = await CropTrade.findById(trade_id).populate('farmer_id', 'farmer_name');
    if (!trade) {
      return res.status(404).json({ success: false, message: 'Crop trade not found' });
    }

    if (trade.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock available' });
    }

    const cartItem = {
      trade_id: trade._id,
      crop_name: trade.crop_name,
      farmer_name: trade.farmer_id.farmer_name,
      farmer_id: trade.farmer_id._id,
      quantity: quantity,
      cost_per_kg: trade.cost_per_kg,
      total_price: trade.cost_per_kg * quantity
    };

    res.json({
      success: true,
      message: 'Item added to cart',
      cartItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process simplified checkout for tests
// @route   POST /api/customer/checkout
const customerCheckout = async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No items provided for checkout' });
    }

    const stripeService = require('../services/stripeService');
    const lineItems = items.map(item => ({
      crop_name: item.crop_name,
      quantity: item.quantity,
      cost_per_kg: item.price / item.quantity,
      total: item.price
    }));

    const session = await stripeService.createCheckoutSession(lineItems, total);

    res.json({
      success: true,
      message: 'Stripe checkout session created successfully',
      session_id: session.id,
      url: session.url
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCustomerProfile,
  updateCustomerProfile,
  getMarketplace,
  addToCart,
  customerCheckout
};
