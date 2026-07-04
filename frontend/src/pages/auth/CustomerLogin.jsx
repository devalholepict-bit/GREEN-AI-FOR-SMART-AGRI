import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import '../../styles/Auth.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { customerLogin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(email && password) {
      try {
        setLoading(true);
        const res = await axiosInstance.post('/auth/customer/login', { email, password });
        if(res.data.success) {
          toast.success('Welcome back!');
          customerLogin(res.data.customer, res.data.token);
          setTimeout(() => navigate('/customer/dashboard'), 500);
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
      <div className="auth-left" style={{background: 'linear-gradient(135deg, var(--earth-brown), var(--light-green))'}}>
        <motion.div className="auth-left-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <h1>Welcome Back 🛒</h1>
          <p>Fresh crops waiting for you. Access our transparent digital marketplace to buy freshly harvested crops directly from local farmers at zero hidden commissions.</p>
        </motion.div>
      </div>
      
      <div className="auth-right">
        <motion.div className="auth-form-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2>Customer Login</h2>
          <p className="auth-subtitle">Sign back in to explore fresh produce.</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="customer@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
              {loading ? 'Entering...' : 'Login as Customer'}
            </button>
          </form>
          <p className="auth-link-text">
            New here? <Link to="/customer/register">Create a customer account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerLogin;
