const CropTrade = require('../models/CropTrade');
const TransactionHistory = require('../models/TransactionHistory');
const stripeService = require('../services/stripeService');

// @desc    Create checkout session (Stripe)
// @route   POST /api/checkout/create-session
const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;
    // items: [{ trade_id, quantity }]

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No items provided for checkout' });
    }

    // Validate items and calculate totals
    const lineItems = [];
    const tradeDetails = [];

    for (const item of items) {
      const trade = await CropTrade.findById(item.trade_id).populate('farmer_id', 'farmer_name');
      if (!trade) {
        return res.status(404).json({ success: false, message: `Trade ${item.trade_id} not found` });
      }
      if (trade.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${trade.crop_name}. Available: ${trade.quantity} kg`
        });
      }

      lineItems.push({
        crop_name: trade.crop_name,
        quantity: item.quantity,
        cost_per_kg: trade.cost_per_kg,
        total: trade.cost_per_kg * item.quantity
      });

      tradeDetails.push({
        trade_id: trade._id,
        farmer_id: trade.farmer_id._id,
        crop_name: trade.crop_name,
        quantity: item.quantity,
        price: trade.cost_per_kg * item.quantity
      });
    }

    const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);

    // Create Stripe session
    const session = await stripeService.createCheckoutSession(lineItems, totalAmount);

    res.json({
      success: true,
      session_id: session.id,
      url: session.url,
      totalAmount,
      lineItems,
      tradeDetails
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Handle payment success - update stock and create transaction history
// @route   POST /api/checkout/payment-success
const paymentSuccess = async (req, res) => {
  try {
    const { tradeDetails, customer_id } = req.body;
    // tradeDetails: [{ trade_id, farmer_id, crop_name, quantity, price }]

    if (!tradeDetails || !customer_id) {
      return res.status(400).json({ success: false, message: 'Trade details and customer ID are required' });
    }

    const transactions = [];

    for (const detail of tradeDetails) {
      // Update crop stock
      const trade = await CropTrade.findById(detail.trade_id);
      if (trade) {
        trade.quantity = Math.max(0, trade.quantity - detail.quantity);
        await trade.save();
      }

      // Create transaction history record
      const transaction = await TransactionHistory.create({
        farmer_id: detail.farmer_id,
        customer_id: customer_id,
        crop_name: detail.crop_name,
        quantity: detail.quantity,
        price: detail.price,
        date: new Date()
      });

      transactions.push(transaction);
    }

    res.json({
      success: true,
      message: 'Payment processed successfully. Stock updated and transaction history recorded.',
      transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  paymentSuccess
};
