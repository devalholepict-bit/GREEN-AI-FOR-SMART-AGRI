import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const CropStock = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState('');

  const fetchTrades = async () => { try { const r = await backendAPI.get('/farmer/trades'); setTrades(r.data.trades||[]); } catch{} finally{setLoading(false);} };
  useEffect(() => { fetchTrades(); }, []);

  const handleUpdate = async (id) => {
    try { await backendAPI.put(`/farmer/stock/${id}`, { quantity: parseInt(editQty) }); toast.success('Stock updated'); setEditId(null); fetchTrades(); }
    catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>📦 Crop Stock</h1><p>Manage your listed crop quantities.</p></div>
      <div className="form-card">
        {trades.length === 0 ? <div className="empty-state"><h3>No stock listed</h3></div> :
        <table className="data-table">
          <thead><tr><th>Crop</th><th>Quantity (kg)</th><th>Price/kg</th><th>Actions</th></tr></thead>
          <tbody>{trades.map(t => <tr key={t._id}>
            <td>{t.crop_name}</td>
            <td>{editId === t._id ? <input type="number" value={editQty} onChange={e=>setEditQty(e.target.value)} style={{width:'80px',padding:'0.4rem'}}/> : t.quantity}</td>
            <td>₹{t.cost_per_kg}</td>
            <td>{editId === t._id ? <><button className="btn btn-primary" style={{padding:'0.3rem 0.8rem',fontSize:'0.85rem'}} onClick={()=>handleUpdate(t._id)}>Save</button> <button className="delete-btn" onClick={()=>setEditId(null)}>Cancel</button></> : <button className="btn btn-outline" style={{padding:'0.3rem 0.8rem',fontSize:'0.85rem'}} onClick={()=>{setEditId(t._id);setEditQty(t.quantity)}}>Edit</button>}</td>
          </tr>)}</tbody>
        </table>}
      </div>
    </div>
  );
};
export default CropStock;
