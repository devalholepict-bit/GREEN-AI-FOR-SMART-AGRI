import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import '../../styles/Dashboard.css';

const SellingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { backendAPI.get('/farmer/history').then(r=>setHistory(r.data.history||[])).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const totalEarnings = history.reduce((s, h) => s + (h.total_price || 0), 0);

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>📊 Selling History</h1><p>Track all your past sales.</p></div>
      <div className="stats-row"><div className="stat-card"><h3>₹{totalEarnings}</h3><p>Total Earnings</p></div><div className="stat-card blue"><h3>{history.length}</h3><p>Total Orders</p></div></div>
      <div className="form-card">
        {history.length === 0 ? <div className="empty-state"><h3>No sales yet</h3><p>Start listing crops to receive orders.</p></div> :
        <table className="data-table">
          <thead><tr><th>Crop</th><th>Quantity</th><th>Price</th><th>Customer</th><th>Date</th></tr></thead>
          <tbody>{history.map(h => <tr key={h._id}><td>{h.crop_name}</td><td>{h.quantity} kg</td><td>₹{h.total_price}</td><td>{h.customer_id?.cust_name || '—'}</td><td>{new Date(h.date || h.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
        </table>}
      </div>
    </div>
  );
};
export default SellingHistory;
