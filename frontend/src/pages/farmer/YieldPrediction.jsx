import React, { useState } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { INDIAN_STATES, SEASONS } from '../../constants/indiaData';
import '../../styles/Dashboard.css';

// Removed generic parseResult in favor of explicit extraction

const YieldPrediction = () => {
  const [form, setForm] = useState({ state:'', district:'', season:'', crop:'', area:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setResult(null);
      const res = await backendAPI.post('/ml/yield-prediction', { ...form, area: parseFloat(form.area) });
      const data = res.data.data;
      const yieldValue = data.predicted_yield || data.yield || data.result || data;
      setResult(parseFloat(yieldValue).toFixed(2));
      toast.success('Yield predicted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>📈 Yield Prediction</h1><p>Predict your expected crop yield.</p></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field"><label>State</label>
              <select required value={form.state} onChange={e=>setForm({...form,state:e.target.value})} disabled={loading}>
                <option value="">-- Select --</option>
                {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div className="form-field"><label>District</label><input required value={form.district} onChange={e=>setForm({...form,district:e.target.value})} disabled={loading} placeholder="e.g. Pune" /></div>
            <div className="form-field"><label>Season</label>
              <select required value={form.season} onChange={e=>setForm({...form,season:e.target.value})} disabled={loading}>
                <option value="">-- Select --</option>
                {SEASONS.map(season => <option key={season} value={season}>{season}</option>)}
              </select></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Crop</label><input required value={form.crop} onChange={e=>setForm({...form,crop:e.target.value})} disabled={loading} placeholder="e.g. Rice" /></div>
            <div className="form-field"><label>Area (hectares)</label><input type="number" step="0.1" required value={form.area} onChange={e=>setForm({...form,area:e.target.value})} disabled={loading} placeholder="e.g. 5.5" /></div>
          </div>
          <button className="btn btn-primary" disabled={loading} style={{marginTop:'1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%'}}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Processing...' : 'Predict Yield'}
          </button>
          {loading && <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>🤖 AI model is processing... (may take 10-15 seconds)</p>}
        </form>
        {result && (
          <div className="result-card">
            <span className="result-icon">📊</span>
            <p className="result-label">Predicted Yield</p>
            <h2 className="result-value">
              {result} Quintals
            </h2>
            <p className="result-sub">
              Estimated crop yield for selected area
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default YieldPrediction;
