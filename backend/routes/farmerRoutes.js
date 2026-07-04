const express = require('express');
const router = express.Router();
const { protect, farmerOnly } = require('../middleware/authMiddleware');
const {
  getFarmerProfile,
  updateFarmerProfile,
  addCropTrade,
  getFarmerTrades,
  getFarmerHistory,
  updateCropStock,
  deleteCropTrade
} = require('../controllers/farmerController');

// All routes protected by JWT + farmer role
router.use(protect, farmerOnly);

router.get('/profile', getFarmerProfile);
router.put('/profile', updateFarmerProfile);
router.post('/trade', addCropTrade);
router.get('/trades', getFarmerTrades);
router.delete('/trade/:id', deleteCropTrade);
router.get('/history', getFarmerHistory);
router.put('/stock/:id', updateCropStock);

module.exports = router;
