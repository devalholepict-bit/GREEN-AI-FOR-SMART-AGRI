import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const FarmerProfile = () => {
  const { farmer, farmerLogin } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendAPI.get('/farmer/profile').then(r => { setProfile(r.data.farmer); setForm(r.data.farmer); }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await backendAPI.put('/farmer/profile', form);
      setProfile(res.data.farmer); setEditing(false);
      farmerLogin(res.data.farmer, localStorage.getItem('farmerToken'));
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to update profile'); }
  };

  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Farmer Profile</h1>
        <button className="btn btn-primary" style={{marginTop:'0.5rem'}} onClick={()=>editing ? handleSave() : setEditing(true)}>{editing ? 'Save Changes' : 'Edit Profile'}</button>
      </div>
      <div className="form-card">
        <div className="profile-grid">
          {['farmer_name','email','phone_no','gender','birthday','state','district','location'].map(key => (
            <div className="profile-field" key={key}>
              <label>{key.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</label>
              {editing && key !== 'email' ? <input value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/> : <span>{profile?.[key] || '—'}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FarmerProfile;
