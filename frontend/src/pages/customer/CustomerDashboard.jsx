import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import backendAPI from '../../api/axios';
import { FaShoppingCart, FaStore } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const CustomerDashboard = () => {
  const { customer } = useContext(AuthContext);
  const [cropCount, setCropCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendAPI.get('/customer/marketplace').then(r => setCropCount(r.data.count || 0)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Welcome, {customer?.cust_name || 'Customer'}! 🛒</h1><p>Browse fresh crops and manage your orders.</p></div>
      <div className="stats-row">
        <div className="stat-card"><h3>{cropCount}</h3><p>Available Crops</p></div>
      </div>
      <div className="form-card">
        <h2>Quick Actions</h2>
        <div className="quick-links">
          <Link to="/customer/marketplace" className="quick-link"><FaStore /> Browse Marketplace</Link>
          <Link to="/customer/cart" className="quick-link"><FaShoppingCart /> View Cart</Link>
        </div>
      </div>
    </div>
  );
};
export default CustomerDashboard;
