import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => { try { const r = await backendAPI.get('/admin/farmers'); setFarmers(r.data.farmers||[]); } catch{} finally{setLoading(false);} };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this farmer and all their trades?')) return;
    try { await backendAPI.delete(`/admin/farmers/${id}`); toast.success('Farmer deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  const filtered = farmers.filter(f => f.farmer_name.toLowerCase().includes(search.toLowerCase()) || f.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Farmers List ({farmers.length})</h1></div>
      <div className="search-bar"><input placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="form-card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>State</th><th>District</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(f => <tr key={f._id}><td>{f.farmer_name}</td><td>{f.email}</td><td>{f.phone_no}</td><td>{f.state}</td><td>{f.district}</td><td><button className="delete-btn" onClick={()=>handleDelete(f._id)}>Delete</button></td></tr>)}</tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><h3>No farmers found</h3></div>}
      </div>
    </div>
  );
};
export default FarmersList;
