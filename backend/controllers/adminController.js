const Farmer = require('../models/Farmer');
const Customer = require('../models/Customer');
const CropTrade = require('../models/CropTrade');
const ContactTicket = require('../models/ContactTicket');

// @desc    Get all farmers
// @route   GET /api/admin/farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: farmers.length, farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a farmer
// @route   DELETE /api/admin/farmers/:id
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    // Also delete farmer's trades
    await CropTrade.deleteMany({ farmer_id: req.params.id });

    await Farmer.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Farmer and their trades deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/admin/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all crop stocks
// @route   GET /api/admin/crops
const getAllCrops = async (req, res) => {
  try {
    const crops = await CropTrade.find()
      .populate('farmer_id', 'farmer_name email state district')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact queries
// @route   GET /api/admin/queries
const getAllQueries = async (req, res) => {
  try {
    const queries = await ContactTicket.find().sort({ createdAt: -1 });
    res.json({ success: true, count: queries.length, queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllFarmers,
  deleteFarmer,
  getAllCustomers,
  deleteCustomer,
  getAllCrops,
  getAllQueries
};
