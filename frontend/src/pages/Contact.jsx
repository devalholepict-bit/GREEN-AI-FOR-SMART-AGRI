import React, { useState } from 'react';
import backendAPI from '../api/axios';
import toast from 'react-hot-toast';
import '../styles/Dashboard.css';

const Contact = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', message:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await backendAPI.post('/marketplace/contact', form);
      toast.success('Message sent successfully!');
      setForm({ name:'', email:'', phone:'', address:'', message:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page">
      <div className="page-header" style={{textAlign:'center'}}><h1>📬 Contact Us</h1><p>Have a question? We'd love to hear from you.</p></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field"><label>Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div className="form-field"><label>Email</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            <div className="form-field"><label>Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
          </div>
          <div className="form-field" style={{marginBottom:'1rem'}}><label>Message</label><textarea required rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{padding:'0.85rem',border:'1px solid #E0E0E0',borderRadius:'10px',fontSize:'0.95rem',fontFamily:'inherit',resize:'vertical'}}/></div>
          <button className="btn btn-primary" style={{width:'100%'}} disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
