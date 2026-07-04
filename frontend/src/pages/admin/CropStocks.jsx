import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import '../../styles/Dashboard.css';

const CropStocks = () => {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { backendAPI.get('/admin/crops').then(r=>setCrops(r.data.crops||[])).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const filtered = crops.filter(c => c.crop_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Crop Stocks ({crops.length})</h1></div>
      <div className="search-bar"><input placeholder="Search crops..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="form-card">
        <table className="data-table">
          <thead><tr><th>Crop Name</th><th>Quantity</th><th>Price/kg</th><th>Farmer</th><th>State</th></tr></thead>
          <tbody>{filtered.map(c => <tr key={c._id}><td>{c.crop_name}</td><td>{c.quantity} kg</td><td>₹{c.cost_per_kg}</td><td>{c.farmer_id?.farmer_name || '—'}</td><td>{c.farmer_id?.state || '—'}</td></tr>)}</tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><h3>No crops found</h3></div>}
      </div>
    </div>
  );
};
export default CropStocks;
