import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const PaymentSuccess = () => (
  <div className="success-page">
    <div className="success-checkmark"><FaCheckCircle /></div>
    <h1>Payment Successful! 🎉</h1>
    <p style={{color:'#666',marginBottom:'2rem',fontSize:'1.1rem'}}>Your order has been confirmed. The farmer will begin processing your order shortly.</p>
    <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
      <Link to="/customer/marketplace" className="btn btn-primary">Continue Shopping</Link>
      <Link to="/customer/dashboard" className="btn btn-outline">Back to Dashboard</Link>
    </div>
  </div>
);
export default PaymentSuccess;
