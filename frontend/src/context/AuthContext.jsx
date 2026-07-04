import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on app load for all tokens
    const fToken = localStorage.getItem('farmerToken');
    const cToken = localStorage.getItem('customerToken');
    const aToken = localStorage.getItem('adminToken');

    const fUser = localStorage.getItem('farmerUser');
    const cUser = localStorage.getItem('customerUser');
    const aUser = localStorage.getItem('adminUser');

    if (fToken && fUser) setFarmer(JSON.parse(fUser));
    if (cToken && cUser) setCustomer(JSON.parse(cUser));
    if (aToken && aUser) setAdmin(JSON.parse(aUser));

    setLoading(false);
  }, []);

  // --- FARMER AUTH ---
  const farmerLogin = (userData, token) => {
    localStorage.setItem('farmerToken', token);
    localStorage.setItem('farmerUser', JSON.stringify(userData));
    setFarmer(userData);
  };

  const farmerLogout = () => {
    localStorage.removeItem('farmerToken');
    localStorage.removeItem('farmerUser');
    setFarmer(null);
  };

  // --- CUSTOMER AUTH ---
  const customerLogin = (userData, token) => {
    localStorage.setItem('customerToken', token);
    localStorage.setItem('customerUser', JSON.stringify(userData));
    setCustomer(userData);
  };

  const customerLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    setCustomer(null);
  };

  // --- ADMIN AUTH ---
  const adminLogin = (userData, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setAdmin(userData);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{
      farmer, farmerLogin, farmerLogout,
      customer, customerLogin, customerLogout,
      admin, adminLogin, adminLogout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
