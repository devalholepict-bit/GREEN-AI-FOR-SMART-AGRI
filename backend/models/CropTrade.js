const mongoose = require('mongoose');

const cropTradeSchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: [true, 'Farmer ID is required']
  },
  crop_name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  cost_per_kg: {
    type: Number,
    required: [true, 'Cost per kg is required'],
    min: [0, 'Cost cannot be negative']
  },
  msp: {
    type: Number,
    default: 0,
    min: [0, 'MSP cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CropTrade', cropTradeSchema);
