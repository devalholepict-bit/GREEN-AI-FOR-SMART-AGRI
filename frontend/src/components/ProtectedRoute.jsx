import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const FarmerProtected = ({ children }) => {
  const { farmer, loading } = useContext(AuthContext);
  if (loading) return <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p>Loading...</p></div>;
  return farmer ? children : <Navigate to="/farmer/login" />;
};

export const CustomerProtected = ({ children }) => {
  const { customer, loading } = useContext(AuthContext);
  if (loading) return <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p>Loading...</p></div>;
  return customer ? children : <Navigate to="/customer/login" />;
};

export const AdminProtected = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  if (loading) return <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p>Loading...</p></div>;
  return admin ? children : <Navigate to="/admin/login" />;
};
