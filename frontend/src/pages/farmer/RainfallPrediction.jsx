import React, { useState } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { RAINFALL_SUBDIVISIONS, MONTHS } from '../../constants/indiaData';
import '../../styles/Dashboard.css';

// Removed generic parseResult in favor of explicit extraction

const RainfallPrediction = () => {
  const [form, setForm] = useState({ subdivision:'', month:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setResult(null);
      const res = await backendAPI.post('/ml/rainfall-prediction', form);
      const data = res.data.data;
      const rainfallValue = data.predicted_rainfall || data.rainfall || data.result || data;
      setResult(parseFloat(rainfallValue).toFixed(2));
      toast.success('Prediction complete!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🌧️ Rainfall Prediction</h1><p>Forecast rainfall for your region.</p></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field"><label>Subdivision</label>
              <select required value={form.subdivision} onChange={e=>setForm({...form,subdivision:e.target.value})} disabled={loading}>
                <option value="">-- Select --</option>
                {RAINFALL_SUBDIVISIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            <div className="form-field"><label>Month</label>
              <select required value={form.month} onChange={e=>setForm({...form,month:e.target.value})} disabled={loading}>
                <option value="">-- Select --</option>
                {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" disabled={loading} style={{marginTop:'1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%'}}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Processing...' : 'Predict Rainfall'}
          </button>
          {loading && <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>🤖 AI model is processing... (may take 10-15 seconds)</p>}
        </form>
        {result && (
          <div className="result-card">
            <span className="result-icon">🌧️</span>
            <p className="result-label">Predicted Rainfall</p>
            <h2 className="result-value">
              {result} mm
            </h2>
            <p className="result-sub">
              Expected rainfall for selected region
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default RainfallPrediction;
