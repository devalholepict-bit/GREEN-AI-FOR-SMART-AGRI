import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const Marketplace = () => {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { backendAPI.get('/customer/marketplace').then(r=>setCrops(r.data.crops||[])).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const filtered = crops.filter(c => c.crop_name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (crop) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find(c => c._id === crop._id);
    if (exists) { exists.qty += 1; } else { cart.push({ _id: crop._id, crop_name: crop.crop_name, cost_per_kg: crop.cost_per_kg, qty: 1, farmer_name: crop.farmer_id?.farmer_name || 'Unknown', max: crop.quantity }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${crop.crop_name} added to cart!`);
  };

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div><p>Loading marketplace...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🏪 Marketplace</h1><p>Browse and buy fresh crops directly from farmers.</p></div>
      <div className="search-bar"><input placeholder="Search crops..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {filtered.length === 0 ? <div className="empty-state"><h3>No crops available</h3><p>Check back later for fresh listings.</p></div> :
      <div className="marketplace-grid">
        {filtered.map(c => (
          <div className="crop-card" key={c._id}>
            <h3>{c.crop_name}</h3>
            <div className="price">₹{c.cost_per_kg}/kg</div>
            <p style={{color:'#666',marginBottom:'0.5rem'}}>Available: {c.quantity} kg</p>
            <p className="farmer-info">👨‍🌾 {c.farmer_id?.farmer_name || 'Unknown'} — {c.farmer_id?.state || ''}, {c.farmer_id?.district || ''}</p>
            <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>addToCart(c)}>Add to Cart</button>
          </div>
        ))}
      </div>}
    </div>
  );
};
export default Marketplace;
