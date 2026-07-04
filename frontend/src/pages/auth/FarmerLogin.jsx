import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import '../../styles/Auth.css';

const FarmerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { farmerLogin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(email && password) {
      try {
        setLoading(true);
        const res = await axiosInstance.post('/auth/farmer/login', { email, password });
        if(res.data.success) {
          toast.success('Login successful!');
          farmerLogin(res.data.farmer, res.data.token);
          setTimeout(() => navigate('/farmer/dashboard'), 500);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please enter email and password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <motion.div className="auth-left-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <h1>Welcome Back Farmer 🌾</h1>
          <p>Your smart farming assistant awaits. Sign in to monitor crops, view smart ML predictions, and sell directly via our marketplace.</p>
        </motion.div>
      </div>
      
      <div className="auth-right">
        <motion.div className="auth-form-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2>Farmer Login</h2>
          <p className="auth-subtitle">Enter your credentials to access your account.</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="farmer@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
              {loading ? 'Authenticating...' : 'Login as Farmer'}
            </button>
          </form>

          <p className="auth-link-text">
            Don't have an account? <Link to="/farmer/register">Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FarmerLogin;
