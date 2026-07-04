const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// ROUTES
// ========================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farmer', require('./routes/farmerRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ml', require('./routes/mlRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Agriculture Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Agriculture Portal API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      farmer: '/api/farmer',
      customer: '/api/customer',
      admin: '/api/admin',
      ml: '/api/ml',
      marketplace: '/api/marketplace',
      checkout: '/api/checkout',
      health: '/api/health'
    }
  });
});

// ========================
// ERROR HANDLING
// ========================
app.use(notFound);
app.use(errorHandler);

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Try connecting to MongoDB (non-blocking)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("✅ All routes loaded");
  });
};

// Handle unhandled promise rejections (prevent crash)
process.on('unhandledRejection', (err) => {
  console.error(`⚠️  Unhandled Rejection: ${err.message}`);
});

startServer();
