import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const TradeCrops = () => {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ crop_name:'', quantity:'', cost_per_kg:'' });
  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => { try { const r = await backendAPI.get('/farmer/trades'); setTrades(r.data.trades||[]); } catch{} finally { setLoading(false); } };
  useEffect(() => { fetchTrades(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await backendAPI.post('/farmer/trade', { crop_name: form.crop_name, quantity: parseInt(form.quantity), cost_per_kg: parseFloat(form.cost_per_kg) });
      toast.success('Crop added to marketplace!');
      setForm({ crop_name:'', quantity:'', cost_per_kg:'' }); fetchTrades();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this crop listing?')) return;
    try { await backendAPI.delete(`/farmer/trade/${id}`); toast.success('Deleted'); fetchTrades(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🛒 Trade Crops</h1><p>List your crops for sale on the marketplace.</p></div>
      <div className="form-card">
        <h2>Add New Crop</h2>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-field"><label>Crop Name</label><input required value={form.crop_name} onChange={e=>setForm({...form,crop_name:e.target.value})}/></div>
            <div className="form-field"><label>Quantity (kg)</label><input type="number" required value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/></div>
            <div className="form-field"><label>Price per kg (₹)</label><input type="number" step="0.01" required value={form.cost_per_kg} onChange={e=>setForm({...form,cost_per_kg:e.target.value})}/></div>
          </div>
          <button className="btn btn-primary" style={{marginTop:'1rem'}}>Add Crop</button>
        </form>
      </div>
      <div className="form-card">
        <h2>Your Listings ({trades.length})</h2>
        {trades.length === 0 ? <div className="empty-state"><h3>No crops listed yet</h3></div> :
        <table className="data-table">
          <thead><tr><th>Crop</th><th>Qty (kg)</th><th>Price/kg</th><th>Actions</th></tr></thead>
          <tbody>
            {trades.map(t => <tr key={t._id}><td>{t.crop_name}</td><td>{t.quantity}</td><td>₹{t.cost_per_kg}</td><td><button className="delete-btn" onClick={()=>handleDelete(t._id)}>Delete</button></td></tr>)}
          </tbody>
        </table>}
      </div>
    </div>
  );
};
export default TradeCrops;
