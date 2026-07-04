import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import '../../styles/Dashboard.css';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { backendAPI.get('/admin/queries').then(r=>setQueries(r.data.queries||[])).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Support Queries ({queries.length})</h1></div>
      <div className="form-card">
        {queries.length === 0 ? <div className="empty-state"><h3>No queries yet</h3></div> :
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th></tr></thead>
          <tbody>{queries.map(q => <tr key={q._id}>
            <td>{q.name}</td><td>{q.email}</td><td>{q.phone || '—'}</td>
            <td><span style={{cursor:'pointer',color:'var(--primary-green)',fontWeight:600}} onClick={()=>setModal(q)}>{q.message?.substring(0,40)}...</span></td>
            <td>{new Date(q.createdAt).toLocaleDateString()}</td>
          </tr>)}</tbody>
        </table>}
      </div>
      {modal && <div className="modal-overlay" onClick={()=>setModal(null)}>
        <div className="modal-content" onClick={e=>e.stopPropagation()}>
          <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
          <h3>Query from {modal.name}</h3>
          <p style={{color:'#666',marginBottom:'1rem'}}>{modal.email} • {modal.phone || 'No phone'}</p>
          <p style={{lineHeight:1.7}}>{modal.message}</p>
        </div>
      </div>}
    </div>
  );
};
export default Queries;
