import React, { useState } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { INDIAN_STATES, SEASONS } from '../../constants/indiaData';
import '../../styles/Dashboard.css';

const CropPrediction = () => {
  const [form, setForm] = useState({ state: '', district: '', season: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setResult(null);
      const res = await backendAPI.post('/ml/crop-prediction', form);
      const data = res.data.data;
      setResult(data);
      toast.success('Prediction complete!');
    } catch (err) { toast.error(err.response?.data?.message || 'Prediction failed'); }
    finally { setLoading(false); }
  };

  // Extract crops array from response
  const getCrops = () => {
    if (!result) return [];
    if (result.crops && Array.isArray(result.crops)) return result.crops;
    if (result.top_crops && Array.isArray(result.top_crops)) return result.top_crops;
    if (result.prediction) return [result.prediction];
    return [];
  };

  const crops = getCrops();
  const method = result?.method;
  const warning = result?.warning;
  const suggestions = result?.suggested_districts;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🌾 Crop Prediction</h1><p>Predict the best crop for your region and season using AI.</p></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field"><label>State</label>
              <select required value={form.state} onChange={e=>setForm({...form,state:e.target.value})} disabled={loading}>
                <option value="">-- Select State --</option>
                {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div className="form-field"><label>District</label>
              <input
                required
                value={form.district}
                onChange={e=>setForm({...form,district:e.target.value})}
                disabled={loading}
                placeholder="e.g. Pune, Bhopal, Udupi"
              />
              <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                Enter district name as it appears in official records
              </span>
            </div>
            <div className="form-field"><label>Season</label>
              <select required value={form.season} onChange={e=>setForm({...form,season:e.target.value})} disabled={loading}>
                <option value="">-- Select Season --</option>
                {SEASONS.map(season => <option key={season} value={season}>{season}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" disabled={loading || !form.state || !form.district || !form.season} style={{marginTop:'1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%'}}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Processing...' : 'Predict Crop'}
          </button>
          {loading && <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>🤖 AI model is processing...</p>}
        </form>

        {/* Warning for invalid district */}
        {result && warning && (
          <div style={{
            background: '#FFF3CD',
            border: '1px solid #FFECB5',
            borderRadius: '12px',
            padding: '16px 20px',
            marginTop: '16px',
            color: '#856404',
            fontSize: '0.9rem'
          }}>
            ⚠️ {warning}
            {suggestions && suggestions.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <strong>Try these districts:</strong>{' '}
                {suggestions.map((d, i) => (
                  <span
                    key={d}
                    onClick={() => setForm(prev => ({ ...prev, district: d }))}
                    style={{
                      cursor: 'pointer',
                      background: '#fff',
                      border: '1px solid #FFECB5',
                      borderRadius: '6px',
                      padding: '2px 10px',
                      marginLeft: i > 0 ? '6px' : '4px',
                      display: 'inline-block',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.target.style.background = '#2D6A4F'; e.target.style.color = '#fff'; }}
                    onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#856404'; }}
                  >{d}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Result display with top 3 crops */}
        {result && crops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="result-card"
          >
            <span className="result-icon">🌾</span>
            <p className="result-label">Predicted Crops</p>

            {/* Best crop */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⭐</span>
              <h2 className="result-value" style={{ margin: 0 }}>{crops[0]}</h2>
            </div>

            {/* Additional crops */}
            {crops.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '12px'
              }}>
                {crops.slice(1, 3).map((crop, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    padding: '8px 20px',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    ✓ {crop}
                  </span>
                ))}
              </div>
            )}

            <p className="result-sub" style={{ marginTop: '16px' }}>
              Based on {result.district || form.district}, {result.state || form.state}, {result.season || form.season}
              {method === 'dataset_lookup' && ' • Dataset Match'}
              {method === 'ml_model' && ' • ML Prediction'}
            </p>
          </motion.div>
        )}

        {/* No crops found */}
        {result && crops.length === 0 && !warning && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px',
            color: '#721c24',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No crops found for this combination</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Try adjusting the district name or season.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CropPrediction;
