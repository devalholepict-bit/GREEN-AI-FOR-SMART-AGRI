const Farmer = require('../models/Farmer');
const CropTrade = require('../models/CropTrade');
const TransactionHistory = require('../models/TransactionHistory');

// @desc    Get farmer profile
// @route   GET /api/farmer/profile
const getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select('-password');
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmer/profile
const updateFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    const { farmer_name, phone_no, gender, birthday, state, district, location } = req.body;

    if (farmer_name) farmer.farmer_name = farmer_name;
    if (phone_no) farmer.phone_no = phone_no;
    if (gender) farmer.gender = gender;
    if (birthday) farmer.birthday = birthday;
    if (state) farmer.state = state;
    if (district) farmer.district = district;
    if (location !== undefined) farmer.location = location;

    const updatedFarmer = await farmer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      farmer: {
        _id: updatedFarmer._id,
        farmer_name: updatedFarmer.farmer_name,
        email: updatedFarmer.email,
        phone_no: updatedFarmer.phone_no,
        gender: updatedFarmer.gender,
        birthday: updatedFarmer.birthday,
        state: updatedFarmer.state,
        district: updatedFarmer.district,
        location: updatedFarmer.location
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add crop to marketplace (trade)
// @route   POST /api/farmer/trade
const addCropTrade = async (req, res) => {
  try {
    const { crop_name, quantity, cost_per_kg, msp } = req.body;

    const trade = await CropTrade.create({
      farmer_id: req.user.id,
      crop_name,
      quantity,
      cost_per_kg,
      msp: msp || 0
    });

    res.status(201).json({
      success: true,
      message: 'Crop added to marketplace successfully',
      trade
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get farmer's own trades
// @route   GET /api/farmer/trades
const getFarmerTrades = async (req, res) => {
  try {
    const trades = await CropTrade.find({ farmer_id: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: trades.length, trades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get farmer's selling history
// @route   GET /api/farmer/history
const getFarmerHistory = async (req, res) => {
  try {
    const history = await TransactionHistory.find({ farmer_id: req.user.id })
      .populate('customer_id', 'cust_name email')
      .sort({ date: -1 });
    res.json({ success: true, count: history.length, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop stock
// @route   PUT /api/farmer/stock/:id
const updateCropStock = async (req, res) => {
  try {
    const trade = await CropTrade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }

    // Ensure the trade belongs to the logged-in farmer
    if (trade.farmer_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this trade' });
    }

    const { quantity, cost_per_kg, msp } = req.body;

    if (quantity !== undefined) trade.quantity = quantity;
    if (cost_per_kg !== undefined) trade.cost_per_kg = cost_per_kg;
    if (msp !== undefined) trade.msp = msp;

    const updatedTrade = await trade.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      trade: updatedTrade
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a crop trade
// @route   DELETE /api/farmer/trade/:id
const deleteCropTrade = async (req, res) => {
  try {
    const trade = await CropTrade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }
    if (trade.farmer_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await CropTrade.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Trade deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFarmerProfile,
  updateFarmerProfile,
  addCropTrade,
  getFarmerTrades,
  getFarmerHistory,
  updateCropStock,
  deleteCropTrade
};

