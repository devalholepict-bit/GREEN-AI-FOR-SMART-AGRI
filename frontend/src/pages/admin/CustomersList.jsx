import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => { try { const r = await backendAPI.get('/admin/customers'); setCustomers(r.data.customers||[]); } catch{} finally{setLoading(false);} };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try { await backendAPI.delete(`/admin/customers/${id}`); toast.success('Customer deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  const filtered = customers.filter(c => c.cust_name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Customers List ({customers.length})</h1></div>
      <div className="search-bar"><input placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="form-card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>State</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(c => <tr key={c._id}><td>{c.cust_name}</td><td>{c.email}</td><td>{c.phone_no}</td><td>{c.city}</td><td>{c.state}</td><td><button className="delete-btn" onClick={()=>handleDelete(c._id)}>Delete</button></td></tr>)}</tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><h3>No customers found</h3></div>}
      </div>
    </div>
  );
};
export default CustomersList;
