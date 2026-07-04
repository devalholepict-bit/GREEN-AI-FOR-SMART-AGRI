import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import { INDIAN_STATES } from '../../constants/indiaData';
import '../../styles/Auth.css';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    cust_name: '', email: '', password: '', phone_no: '', 
    address: '', city: '', pincode: '', state: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { customerLogin } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val !== '')) {
      try {
        setLoading(true);
        const res = await axiosInstance.post('/auth/customer/register', formData);
        if(res.data.success) {
          toast.success('Account created!');
          customerLogin(res.data.customer, res.data.token);
          setTimeout(() => navigate('/customer/dashboard'), 500);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error creating account');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill all fields');
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="auth-page">
      <div className="auth-left" style={{background: 'linear-gradient(135deg, var(--earth-brown), var(--light-green))'}}>
        <motion.div className="auth-left-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <h1>Join as Customer 🌿</h1>
          <p>Buy fresh crops directly from farmers. Register as a buyer to connect instantly with regional farmers and place fresh batch crop orders securely.</p>
        </motion.div>
      </div>
      
      <div className="auth-right" style={{ overflowX: 'hidden' }}>
        <motion.div className="auth-form-container" style={{maxWidth:'700px', width: '100%', boxSizing: 'border-box'}} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2>Customer Registration</h2>
          <p className="auth-subtitle">Join the buyer network today.</p>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="cust_name" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_no" onChange={handleChange} required />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <input type="text" name="address" onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
              <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '120px' }}>
                 <label>City</label>
                 <input type="text" name="city" onChange={handleChange} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '120px' }}>
                 <label>State</label>
                 <select name="state" onChange={handleChange} required style={{padding:'1rem', width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem'}}>
                    <option value="">-- Select --</option>
                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                 </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '120px' }}>
                 <label>Pincode</label>
                 <input type="text" name="pincode" onChange={handleChange} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
              {loading ? 'Creating Profile...' : 'Register as Customer'}
            </button>
          </form>

          <p className="auth-link-text">
            Already registered? <Link to="/customer/login">Login here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerRegister;
