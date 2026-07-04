const express = require('express');
const router = express.Router();
const {
  getAllMarketplaceCrops,
  getCropDetail,
  submitContactForm
} = require('../controllers/marketplaceController');
const newsService = require('../services/newsService');
const weatherService = require('../services/weatherService');
const openaiService = require('../services/openaiService');

// Public marketplace routes
router.get('/crops', getAllMarketplaceCrops);
router.get('/crops/:id', getCropDetail);
router.post('/contact', submitContactForm);

// News feed route
router.get('/news', async (req, res) => {
  try {
    const articles = await newsService.getAgricultureNews();
    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Weather forecast route
router.get('/weather/:city', async (req, res) => {
  try {
    const weatherData = await weatherService.getWeatherForecast(req.params.city);
    res.json({ success: true, data: weatherData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ChatGPT assistant route
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const reply = await openaiService.chatWithAI(message);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
