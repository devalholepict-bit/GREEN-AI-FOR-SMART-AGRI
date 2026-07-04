import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backendAPI from '../../api/axios';
import { FaUsers, FaUserFriends, FaLeaf, FaEnvelope } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ farmers:0, customers:0, crops:0, queries:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [f,c,cr,q] = await Promise.all([
          backendAPI.get('/admin/farmers'),backendAPI.get('/admin/customers'),backendAPI.get('/admin/crops'),backendAPI.get('/admin/queries')
        ]);
        setStats({ farmers: f.data.count||0, customers: c.data.count||0, crops: cr.data.count||0, queries: q.data.count||0 });
      } catch{}
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Admin Dashboard 🛡️</h1><p>System overview and management panel.</p></div>
      <div className="stats-row">
        <div className="stat-card"><div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}><FaUsers size={24} color="var(--primary-green)"/><div><h3>{stats.farmers}</h3><p>Total Farmers</p></div></div></div>
        <div className="stat-card blue"><div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}><FaUserFriends size={24} color="#0077b6"/><div><h3>{stats.customers}</h3><p>Total Customers</p></div></div></div>
        <div className="stat-card orange"><div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}><FaLeaf size={24} color="var(--yellow-gold)"/><div><h3>{stats.crops}</h3><p>Total Crops</p></div></div></div>
        <div className="stat-card red"><div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}><FaEnvelope size={24} color="#e63946"/><div><h3>{stats.queries}</h3><p>Queries</p></div></div></div>
      </div>
      <div className="form-card"><h2>Quick Navigation</h2>
        <div className="quick-links">
          <Link to="/admin/farmers" className="quick-link"><FaUsers /> Manage Farmers</Link>
          <Link to="/admin/customers" className="quick-link"><FaUserFriends /> Manage Customers</Link>
          <Link to="/admin/crops" className="quick-link"><FaLeaf /> Crop Stocks</Link>
          <Link to="/admin/queries" className="quick-link"><FaEnvelope /> Support Queries</Link>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
