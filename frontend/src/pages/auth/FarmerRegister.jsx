import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import { INDIAN_STATES } from '../../constants/indiaData';
import '../../styles/Auth.css';

const FarmerRegister = () => {
  const [formData, setFormData] = useState({
    farmer_name: '', email: '', password: '', phone_no: '', 
    gender: 'Male', birthday: '', state: '', district: '', location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { farmerLogin } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val !== '')) {
      try {
        setLoading(true);
        const res = await axiosInstance.post('/auth/farmer/register', formData);
        if(res.data.success) {
          toast.success('Registration successful!');
          farmerLogin(res.data.farmer, res.data.token);
          setTimeout(() => navigate('/farmer/dashboard'), 500);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error occurred during registration');
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
      <div className="auth-left">
        <motion.div className="auth-left-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <h1>Join Green AI 🌱</h1>
          <p>Start your smart farming journey. Register to unlock powerful AI insights, precise crop yield predictions, and a direct digital marketplace.</p>
        </motion.div>
      </div>
      
      <div className="auth-right" style={{ overflowX: 'hidden' }}>
        <motion.div className="auth-form-container" style={{maxWidth:'700px', width: '100%', boxSizing: 'border-box'}} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2>Farmer Registration</h2>
          <p className="auth-subtitle">Create a new account to get started.</p>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="farmer_name" onChange={handleChange} required />
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

            <div className="grid-2">
              <div className="form-group">
                 <label>Gender</label>
                 <select name="gender" onChange={handleChange}>
                   <option>Male</option>
                   <option>Female</option>
                   <option>Other</option>
                 </select>
              </div>
              <div className="form-group">
                 <label>Date of Birth</label>
                 <input type="date" name="birthday" onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
              <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '120px' }}>
                 <label>State</label>
                 <select name="state" onChange={handleChange} required style={{width: '100%', boxSizing: 'border-box', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem'}}>
                   <option value="">-- Select --</option>
                   {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                 </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '120px' }}>
                 <label>District</label>
                 <input type="text" name="district" onChange={handleChange} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div className="form-group" style={{ flex: '1 1 calc(33.333% - 1rem)', minWidth: '120px' }}>
                 <label>Pin / Location</label>
                 <input type="text" name="location" onChange={handleChange} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
              {loading ? 'Registering...' : 'Register as Farmer'}
            </button>
          </form>

          <p className="auth-link-text">
            Already registered? <Link to="/farmer/login">Login here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FarmerRegister;
