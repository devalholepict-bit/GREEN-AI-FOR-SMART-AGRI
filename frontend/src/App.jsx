import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { FarmerProtected, CustomerProtected, AdminProtected } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Contact from './pages/Contact';

// Auth
import FarmerLogin from './pages/auth/FarmerLogin';
import FarmerRegister from './pages/auth/FarmerRegister';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import AdminLogin from './pages/auth/AdminLogin';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProfile from './pages/farmer/FarmerProfile';
import CropPrediction from './pages/farmer/CropPrediction';
import CropRecommendation from './pages/farmer/CropRecommendation';
import FertilizerRecommendation from './pages/farmer/FertilizerRecommendation';
import YieldPrediction from './pages/farmer/YieldPrediction';
import RainfallPrediction from './pages/farmer/RainfallPrediction';
import TradeCrops from './pages/farmer/TradeCrops';
import CropStock from './pages/farmer/CropStock';
import SellingHistory from './pages/farmer/SellingHistory';
import NewsFeed from './pages/farmer/NewsFeed';
import WeatherForecast from './pages/farmer/WeatherForecast';
import ChatBot from './pages/farmer/ChatBot';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import Marketplace from './pages/customer/Marketplace';
import Cart from './pages/customer/Cart';
import PaymentSuccess from './pages/customer/PaymentSuccess';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmersList from './pages/admin/FarmersList';
import CustomersList from './pages/admin/CustomersList';
import CropStocks from './pages/admin/CropStocks';
import Queries from './pages/admin/Queries';

const TITLES = {
  "/": "Green AI - Smart Agriculture",
  "/farmer/login": "Farmer Login - Green AI",
  "/farmer/register": "Farmer Register - Green AI",
  "/farmer/dashboard": "Farmer Dashboard - Green AI",
  "/farmer/crop-prediction": "Crop Prediction - Green AI",
  "/farmer/crop-recommendation": "Crop Recommendation - Green AI",
  "/farmer/fertilizer": "Fertilizer Guide - Green AI",
  "/farmer/yield-prediction": "Yield Prediction - Green AI",
  "/farmer/rainfall-prediction": "Rainfall Prediction - Green AI",
  "/farmer/trade": "Trade Crops - Green AI",
  "/farmer/stock": "Crop Stock - Green AI",
  "/farmer/history": "Selling History - Green AI",
  "/farmer/news": "News Feed - Green AI",
  "/farmer/weather": "Weather Forecast - Green AI",
  "/farmer/chatbot": "AI Assistant - Green AI",
  "/farmer/profile": "Farmer Profile - Green AI",
  "/customer/login": "Customer Login - Green AI",
  "/customer/register": "Customer Register - Green AI",
  "/customer/dashboard": "Customer Dashboard - Green AI",
  "/customer/marketplace": "Marketplace - Green AI",
  "/customer/cart": "My Cart - Green AI",
  "/customer/profile": "Customer Profile - Green AI",
  "/customer/payment-success": "Payment Success - Green AI",
  "/admin/login": "Admin Login - Green AI",
  "/admin/dashboard": "Admin Dashboard - Green AI",
  "/admin/farmers": "Farmers List - Green AI",
  "/admin/customers": "Customers List - Green AI",
  "/admin/crops": "Crop Stocks - Green AI",
  "/admin/queries": "Queries - Green AI",
};

const RouteChangeListener = () => {
  const location = useLocation();
  useEffect(() => {
    const title = TITLES[location.pathname] || "Green AI - Smart Agriculture";
    document.title = title;
  }, [location]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteChangeListener />
        <Toaster position="top-center" toastOptions={{ duration: 3000.0, style: { fontFamily: 'Inter, sans-serif' } }} />
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />

            {/* AUTH */}
            <Route path="/farmer/login" element={<FarmerLogin />} />
            <Route path="/farmer/register" element={<FarmerRegister />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* FARMER PROTECTED */}
            <Route path="/farmer/dashboard" element={<FarmerProtected><FarmerDashboard /></FarmerProtected>} />
            <Route path="/farmer/profile" element={<FarmerProtected><FarmerProfile /></FarmerProtected>} />
            <Route path="/farmer/crop-prediction" element={<FarmerProtected><CropPrediction /></FarmerProtected>} />
            <Route path="/farmer/crop-recommendation" element={<FarmerProtected><CropRecommendation /></FarmerProtected>} />
            <Route path="/farmer/fertilizer" element={<FarmerProtected><FertilizerRecommendation /></FarmerProtected>} />
            <Route path="/farmer/yield-prediction" element={<FarmerProtected><YieldPrediction /></FarmerProtected>} />
            <Route path="/farmer/rainfall-prediction" element={<FarmerProtected><RainfallPrediction /></FarmerProtected>} />
            <Route path="/farmer/trade" element={<FarmerProtected><TradeCrops /></FarmerProtected>} />
            <Route path="/farmer/stock" element={<FarmerProtected><CropStock /></FarmerProtected>} />
            <Route path="/farmer/history" element={<FarmerProtected><SellingHistory /></FarmerProtected>} />
            <Route path="/farmer/news" element={<FarmerProtected><NewsFeed /></FarmerProtected>} />
            <Route path="/farmer/weather" element={<FarmerProtected><WeatherForecast /></FarmerProtected>} />
            <Route path="/farmer/chatbot" element={<FarmerProtected><ChatBot /></FarmerProtected>} />

            {/* CUSTOMER PROTECTED */}
            <Route path="/customer/dashboard" element={<CustomerProtected><CustomerDashboard /></CustomerProtected>} />
            <Route path="/customer/profile" element={<CustomerProtected><CustomerProfile /></CustomerProtected>} />
            <Route path="/customer/marketplace" element={<CustomerProtected><Marketplace /></CustomerProtected>} />
            <Route path="/customer/cart" element={<CustomerProtected><Cart /></CustomerProtected>} />
            <Route path="/customer/payment-success" element={<CustomerProtected><PaymentSuccess /></CustomerProtected>} />

            {/* ADMIN PROTECTED */}
            <Route path="/admin/dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
            <Route path="/admin/farmers" element={<AdminProtected><FarmersList /></AdminProtected>} />
            <Route path="/admin/customers" element={<AdminProtected><CustomersList /></AdminProtected>} />
            <Route path="/admin/crops" element={<AdminProtected><CropStocks /></AdminProtected>} />
            <Route path="/admin/queries" element={<AdminProtected><Queries /></AdminProtected>} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
