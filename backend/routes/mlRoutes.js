const express = require('express');
const router = express.Router();
const {
  cropPrediction,
  cropRecommendation,
  fertilizerRecommendation,
  yieldPrediction,
  rainfallPrediction
} = require('../controllers/mlController');

// ML routes - proxy to Flask server
router.post('/crop-prediction', cropPrediction);
router.post('/crop-recommendation', cropRecommendation);
router.post('/fertilizer-recommendation', fertilizerRecommendation);
router.post('/yield-prediction', yieldPrediction);
router.post('/rainfall-prediction', rainfallPrediction);

module.exports = router;
