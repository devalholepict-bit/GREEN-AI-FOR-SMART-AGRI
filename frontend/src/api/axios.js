import axios from 'axios';

// ========== BACKEND API ==========
const backendAPI = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

backendAPI.interceptors.request.use((config) => {
  const farmerToken = localStorage.getItem('farmerToken');
  const customerToken = localStorage.getItem('customerToken');
  const adminToken = localStorage.getItem('adminToken');

  if (farmerToken) config.headers['Authorization'] = `Bearer ${farmerToken}`;
  else if (customerToken) config.headers['Authorization'] = `Bearer ${customerToken}`;
  else if (adminToken) config.headers['Authorization'] = `Bearer ${adminToken}`;
  return config;
}, (error) => Promise.reject(error));

backendAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('farmerToken');
      localStorage.removeItem('farmerUser');
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ========== ML API ==========
const mlAPI = axios.create({
  baseURL: 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

export { backendAPI, mlAPI };
export default backendAPI;
