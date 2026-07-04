const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 * @param {Array} lineItems - Array of { crop_name, quantity, cost_per_kg, total }
 * @param {Number} totalAmount - Total amount in INR
 * @returns {Object} Stripe session object
 */
const createCheckoutSession = async (lineItems, totalAmount) => {
  try {
    const stripeLineItems = lineItems.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.crop_name,
          description: `${item.quantity} kg @ ₹${item.cost_per_kg}/kg`
        },
        unit_amount: Math.round(item.cost_per_kg * 100) // Stripe expects amount in paise
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-cancel`
    });

    return session;
  } catch (error) {
    throw new Error(`Stripe Error: ${error.message}`);
  }
};

/**
 * Retrieve a Stripe Checkout Session
 * @param {String} sessionId - Stripe session ID
 * @returns {Object} Session details
 */
const retrieveSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    throw new Error(`Stripe Error: ${error.message}`);
  }
};

module.exports = {
  createCheckoutSession,
  retrieveSession
};
