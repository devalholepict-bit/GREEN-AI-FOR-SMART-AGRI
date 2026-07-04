import React, { useState } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SOIL_TYPES, CROP_TYPES } from '../../constants/indiaData';
import '../../styles/Dashboard.css';

// Removed generic parseResult in favor of explicit extraction

const FertilizerRecommendation = () => {
  const [form, setForm] = useState({ temperature:'', humidity:'', soil_moisture:'', soil_type:'', crop_type:'', N:'', P:'', K:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setResult(null);
      const payload = { ...form, temperature: parseFloat(form.temperature), humidity: parseFloat(form.humidity), soil_moisture: parseFloat(form.soil_moisture), N: parseFloat(form.N), P: parseFloat(form.P), K: parseFloat(form.K) };
      const res = await backendAPI.post('/ml/fertilizer-recommendation', payload);
      const data = res.data.data;
      const fertilizerValue = data.recommendation || data.fertilizer || data.result || data;
      setResult(fertilizerValue);
      toast.success('Recommendation ready!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🧪 Fertilizer Recommendation</h1><p>Get the right fertilizer based on soil and crop conditions.</p></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field"><label>Temperature (°C)</label><input type="number" step="0.1" required value={form.temperature} onChange={e=>setForm({...form,temperature:e.target.value})} disabled={loading} placeholder="e.g. 26.5" /></div>
            <div className="form-field"><label>Humidity (%)</label><input type="number" step="0.1" required value={form.humidity} onChange={e=>setForm({...form,humidity:e.target.value})} disabled={loading} placeholder="e.g. 52.0" /></div>
            <div className="form-field"><label>Soil Moisture</label><input type="number" step="0.1" required value={form.soil_moisture} onChange={e=>setForm({...form,soil_moisture:e.target.value})} disabled={loading} placeholder="e.g. 38.0" /></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Soil Type</label>
              <select required value={form.soil_type} onChange={e=>setForm({...form,soil_type:e.target.value})}>
                <option value="">-- Select --</option>
                {SOIL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select></div>
            <div className="form-field"><label>Crop Type</label>
              <select required value={form.crop_type} onChange={e=>setForm({...form,crop_type:e.target.value})}>
                <option value="">-- Select --</option>
                {CROP_TYPES.map(crop => <option key={crop} value={crop}>{crop}</option>)}
              </select></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Nitrogen (N)</label><input type="number" required value={form.N} onChange={e=>setForm({...form,N:e.target.value})} disabled={loading} placeholder="0" /></div>
            <div className="form-field"><label>Phosphorus (P)</label><input type="number" required value={form.P} onChange={e=>setForm({...form,P:e.target.value})} disabled={loading} placeholder="0" /></div>
            <div className="form-field"><label>Potassium (K)</label><input type="number" required value={form.K} onChange={e=>setForm({...form,K:e.target.value})} disabled={loading} placeholder="0" /></div>
          </div>
          <button className="btn btn-primary" disabled={loading} style={{marginTop:'1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%'}}>
            {loading ? <span className="spinner"></span> : null}
            {loading ? 'Processing...' : 'Get Fertilizer'}
          </button>
          {loading && <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>🤖 AI model is processing... (may take 10-15 seconds)</p>}
        </form>
        {result && (
          <div className="result-card">
            <span className="result-icon">🧪</span>
            <p className="result-label">Recommended Fertilizer</p>
            <h2 className="result-value">
              {result}
            </h2>
            <p className="result-sub">
              Best fertilizer for your soil and crop
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FertilizerRecommendation;
