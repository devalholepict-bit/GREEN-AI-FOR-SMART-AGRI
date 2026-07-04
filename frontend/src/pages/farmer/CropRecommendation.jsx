import React, { useState } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import '../../styles/Dashboard.css';

// Removed generic parseResult in favor of explicit extraction

const CropRecommendation = () => {
  const [form, setForm] = useState({ N:'', P:'', K:'', temperature:'', humidity:'', pH:'', rainfall:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setResult(null);
      const payload = {}; Object.keys(form).forEach(k => payload[k] = parseFloat(form[k]));
      const res = await backendAPI.post('/ml/crop-recommendation', payload);
      const data = res.data.data;
      const cropValue = data.recommendation || data.crop || data.result || data;
      setResult(cropValue);
      toast.success('Recommendation ready!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🌱 Crop Recommendation</h1><p>Get AI-powered crop suggestions based on soil and weather data.</p></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field"><label>Nitrogen (N)</label><input type="number" required value={form.N} onChange={e=>setForm({...form,N:e.target.value})} disabled={loading} placeholder="0" /></div>
            <div className="form-field"><label>Phosphorus (P)</label><input type="number" required value={form.P} onChange={e=>setForm({...form,P:e.target.value})} disabled={loading} placeholder="0" /></div>
            <div className="form-field"><label>Potassium (K)</label><input type="number" required value={form.K} onChange={e=>setForm({...form,K:e.target.value})} disabled={loading} placeholder="0" /></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Temperature (°C)</label><input type="number" step="0.1" required value={form.temperature} onChange={e=>setForm({...form,temperature:e.target.value})} disabled={loading} placeholder="e.g. 26.5" /></div>
            <div className="form-field"><label>Humidity (%)</label><input type="number" step="0.1" required value={form.humidity} onChange={e=>setForm({...form,humidity:e.target.value})} disabled={loading} placeholder="e.g. 52.0" /></div>
            <div className="form-field"><label>pH Level</label><input type="number" step="0.01" required value={form.pH} onChange={e=>setForm({...form,pH:e.target.value})} disabled={loading} placeholder="e.g. 6.5" /></div>
            <div className="form-field"><label>Rainfall (mm)</label><input type="number" step="0.1" required value={form.rainfall} onChange={e=>setForm({...form,rainfall:e.target.value})} disabled={loading} placeholder="e.g. 200" /></div>
          </div>
          <button className="btn btn-primary" disabled={loading} style={{marginTop:'1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%'}}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Processing...' : 'Get Recommendation'}
          </button>
          {loading && <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>🤖 AI model is processing... (may take 10-15 seconds)</p>}
        </form>
        {result && (
          <div className="result-card">
            <span className="result-icon">🌱</span>
            <p className="result-label">Recommended Crop</p>
            <h2 className="result-value">
              {result}
            </h2>
            <p className="result-sub">
              Best crop for your soil conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CropRecommendation;
