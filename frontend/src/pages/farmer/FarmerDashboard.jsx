import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import backendAPI from '../../api/axios';
import { FaLeaf, FaSeedling, FaChartLine, FaShoppingCart, FaCloudSun, FaNewspaper, FaRobot, FaFlask } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const FarmerDashboard = () => {
  const { farmer } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, h] = await Promise.all([
          backendAPI.get('/farmer/trades'),
          backendAPI.get('/farmer/history')
        ]);
        setTrades(t.data.trades || []);
        setHistory(h.data.history || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Welcome, {farmer?.farmer_name || 'Farmer'}! 🌾</h1>
        <p>Manage your crops, predictions, and marketplace from here.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card"><h3>{trades.length}</h3><p>Crops Listed</p></div>
        <div className="stat-card blue"><h3>{history.length}</h3><p>Total Sales</p></div>
        <div className="stat-card orange"><h3>₹{history.reduce((s, h) => s + (h.total_price || 0), 0)}</h3><p>Total Earnings</p></div>
      </div>

      <div className="form-card">
        <h2>Quick Actions</h2>
        <div className="quick-links">
          <Link to="/farmer/crop-prediction" className="quick-link"><FaLeaf /> Crop Prediction</Link>
          <Link to="/farmer/crop-recommendation" className="quick-link"><FaSeedling /> Crop Recommendation</Link>
          <Link to="/farmer/fertilizer" className="quick-link"><FaFlask /> Fertilizer Guide</Link>
          <Link to="/farmer/yield-prediction" className="quick-link"><FaChartLine /> Yield Prediction</Link>
          <Link to="/farmer/trade" className="quick-link"><FaShoppingCart /> Trade Crops</Link>
          <Link to="/farmer/weather" className="quick-link"><FaCloudSun /> Weather</Link>
          <Link to="/farmer/news" className="quick-link"><FaNewspaper /> News Feed</Link>
          <Link to="/farmer/chatbot" className="quick-link"><FaRobot /> AI Assistant</Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
