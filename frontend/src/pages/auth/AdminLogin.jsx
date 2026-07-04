import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import '../../styles/Auth.css';

const AdminLogin = () => {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(adminName && password) {
      try {
        setLoading(true);
        // Map to equivalent backend logic names. The backend expects 'admin_name' and 'password'
        const res = await axiosInstance.post('/auth/admin/login', { admin_name: adminName, password });
        if(res.data.success) {
          toast.success('Admin access granted');
          adminLogin(res.data.admin, res.data.token);
          setTimeout(() => navigate('/admin/dashboard'), 500);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid credentials');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please enter admin name and password');
    }
  };

  return (
    <div className="admin-auth-page">
      <motion.div 
        className="admin-form-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{textAlign:'center', marginBottom: '1rem', color:'var(--primary-green)', fontSize:'2.5rem'}}>
           <FaShieldAlt />
        </div>
        <h2>Admin Portal</h2>
        <p style={{textAlign: 'center', color: '#BBB', marginBottom: '2rem'}}>Authorized Access Only</p>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Admin Username</label>
            <input type="text" placeholder="admin" value={adminName} onChange={e=>setAdminName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Master Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn" style={{marginTop:'1.5rem'}}>
            {loading ? 'Verifying...' : 'Login as Admin'}
          </button>
        </form>
        
        <div style={{textAlign:'center', marginTop:'2rem'}}>
           <Link to="/" style={{color:'#888', fontSize:'0.9rem', textDecoration:'underline'}}>Return to public portal</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
