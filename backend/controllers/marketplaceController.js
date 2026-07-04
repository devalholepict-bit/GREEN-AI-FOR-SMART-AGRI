const CropTrade = require('../models/CropTrade');
const ContactTicket = require('../models/ContactTicket');

// @desc    Get all marketplace crops (public)
// @route   GET /api/marketplace/crops
const getAllMarketplaceCrops = async (req, res) => {
  try {
    const crops = await CropTrade.find({ quantity: { $gt: 0 } })
      .populate('farmer_id', 'farmer_name state district location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single crop detail
// @route   GET /api/marketplace/crops/:id
const getCropDetail = async (req, res) => {
  try {
    const crop = await CropTrade.findById(req.params.id)
      .populate('farmer_id', 'farmer_name state district location email phone_no');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit contact us form
// @route   POST /api/marketplace/contact
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, address, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const ticket = await ContactTicket.create({
      name,
      email,
      phone,
      address,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your query has been submitted successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllMarketplaceCrops,
  getCropDetail,
  submitContactForm
};
