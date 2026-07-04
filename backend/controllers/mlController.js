const axios = require('axios');

const ML_SERVER = process.env.ML_SERVER_URL || 'http://localhost:5001';

// @desc    Crop Prediction (State, District, Season)
// @route   POST /api/ml/crop-prediction
const cropPrediction = async (req, res) => {
  try {
    const { state, district, season } = req.body;

    if (!state || !district || !season) {
      return res.status(400).json({ success: false, message: 'State, district, and season are required' });
    }

    const response = await axios.post(`${ML_SERVER}/crop-prediction`, {
      state, district, season
    }, { timeout: 4500 });

    res.json({ success: true, data: response.data });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(503).json({ success: false, message: 'Model is warming up, please try again in a moment' });
    }
    const msg = error.response?.data?.error || error.message;
    res.status(500).json({ success: false, message: `ML Server Error: ${msg}` });
  }
};

// @desc    Crop Recommendation (N, P, K, temperature, humidity, pH, rainfall)
// @route   POST /api/ml/crop-recommendation
const cropRecommendation = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, pH, rainfall } = req.body;

    if ([N, P, K, temperature, humidity, pH, rainfall].some(v => v === undefined || v === null)) {
      return res.status(400).json({ success: false, message: 'N, P, K, temperature, humidity, pH, and rainfall are all required' });
    }

    const response = await axios.post(`${ML_SERVER}/crop-recommendation`, {
      N, P, K, temperature, humidity, pH, rainfall
    }, { timeout: 60000 });

    res.json({ success: true, data: response.data });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(503).json({ success: false, message: 'Model is warming up, please try again in a moment' });
    }
    const msg = error.response?.data?.error || error.message;
    res.status(500).json({ success: false, message: `ML Server Error: ${msg}` });
  }
};

// @desc    Fertilizer Recommendation
// @route   POST /api/ml/fertilizer-recommendation
const fertilizerRecommendation = async (req, res) => {
  try {
    const { temperature, humidity, soil_moisture, soil_type, crop_type, N, P, K } = req.body;

    if ([temperature, humidity, soil_moisture, N, P, K].some(v => v === undefined || v === null) || !soil_type || !crop_type) {
      return res.status(400).json({ success: false, message: 'All fields are required: temperature, humidity, soil_moisture, soil_type, crop_type, N, P, K' });
    }

    const response = await axios.post(`${ML_SERVER}/fertilizer-recommendation`, {
      temperature, humidity, soil_moisture, soil_type, crop_type, N, P, K
    }, { timeout: 60000 });

    res.json({ success: true, data: response.data });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(503).json({ success: false, message: 'Model is warming up, please try again in a moment' });
    }
    const msg = error.response?.data?.error || error.message;
    res.status(500).json({ success: false, message: `ML Server Error: ${msg}` });
  }
};

// @desc    Yield Prediction
// @route   POST /api/ml/yield-prediction
const yieldPrediction = async (req, res) => {
  try {
    const { state, district, season, crop, area } = req.body;

    if (!state || !district || !season || !crop || !area) {
      return res.status(400).json({ success: false, message: 'State, district, season, crop, and area are all required' });
    }

    const response = await axios.post(`${ML_SERVER}/yield-prediction`, {
      state, district, season, crop, area
    }, { timeout: 60000 });

    res.json({ success: true, data: response.data });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(503).json({ success: false, message: 'Model is warming up, please try again in a moment' });
    }
    const msg = error.response?.data?.error || error.message;
    res.status(500).json({ success: false, message: `ML Server Error: ${msg}` });
  }
};

// @desc    Rainfall Prediction
// @route   POST /api/ml/rainfall-prediction
const rainfallPrediction = async (req, res) => {
  try {
    const { subdivision, month } = req.body;

    if (!subdivision || !month) {
      return res.status(400).json({ success: false, message: 'Subdivision and month are required' });
    }

    const response = await axios.post(`${ML_SERVER}/rainfall-prediction`, {
      subdivision, month
    }, { timeout: 60000 });

    res.json({ success: true, data: response.data });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(503).json({ success: false, message: 'Model is warming up, please try again in a moment' });
    }
    const msg = error.response?.data?.error || error.message;
    res.status(500).json({ success: false, message: `ML Server Error: ${msg}` });
  }
};

module.exports = {
  cropPrediction,
  cropRecommendation,
  fertilizerRecommendation,
  yieldPrediction,
  rainfallPrediction
};
