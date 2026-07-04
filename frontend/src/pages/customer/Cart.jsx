import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setCart(JSON.parse(localStorage.getItem('cart') || '[]')); }, []);

  const updateQty = (id, qty) => {
    const updated = cart.map(c => c._id === id ? { ...c, qty: Math.max(1, qty) } : c);
    setCart(updated); localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(c => c._id !== id);
    setCart(updated); localStorage.setItem('cart', JSON.stringify(updated));
    toast.success('Item removed');
  };

  const total = cart.reduce((s, c) => s + c.cost_per_kg * c.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    try {
      setLoading(true);
      const items = cart.map(c => ({ crop_name: c.crop_name, quantity: c.qty, price: c.cost_per_kg * c.qty }));
      const res = await backendAPI.post('/customer/checkout', { items, total });
      if (res.data.url) { window.location.href = res.data.url; }
      else { localStorage.removeItem('cart'); toast.success('Checkout complete!'); navigate('/customer/payment-success'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Checkout failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🛒 Your Cart</h1><p>Review your items before checkout.</p></div>
      <div className="form-card">
        {cart.length === 0 ? <div className="empty-state"><h3>Your cart is empty</h3><p>Browse the marketplace to add crops.</p></div> :
        <>
          <table className="data-table">
            <thead><tr><th>Crop</th><th>Farmer</th><th>Price/kg</th><th>Qty</th><th>Total</th><th></th></tr></thead>
            <tbody>{cart.map(c => <tr key={c._id}><td>{c.crop_name}</td><td>{c.farmer_name}</td><td>₹{c.cost_per_kg}</td><td><input type="number" min="1" value={c.qty} style={{width:'60px',padding:'0.3rem'}} onChange={e=>updateQty(c._id, parseInt(e.target.value)||1)}/></td><td>₹{c.cost_per_kg * c.qty}</td><td><button className="delete-btn" onClick={()=>removeItem(c._id)}>Remove</button></td></tr>)}</tbody>
          </table>
          <div className="cart-total"><span>Order Total</span><h3>₹{total}</h3></div>
          <button className="btn btn-primary" style={{width:'100%',marginTop:'1.5rem',padding:'1rem'}} onClick={handleCheckout} disabled={loading}>{loading ? 'Processing...' : 'Proceed to Pay'}</button>
        </>}
      </div>
    </div>
  );
};
export default Cart;
