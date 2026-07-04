import React, { useState } from 'react';
import backendAPI from '../../api/axios';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const WeatherForecast = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return toast.error('Enter a city name');
    try {
      setLoading(true); setWeather(null);
      const res = await backendAPI.get(`/marketplace/weather/${city}`);
      setWeather(res.data.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Weather fetch failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>🌤️ Weather Forecast</h1><p>Check real-time weather for any city.</p></div>
      <div className="form-card">
        <form onSubmit={handleSearch} style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
          <input style={{flex:1,padding:'0.85rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'1rem',minWidth:'200px'}} placeholder="Enter city name..." value={city} onChange={e=>setCity(e.target.value)}/>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Checking...' : 'Check Weather'}</button>
        </form>
      </div>
      {weather && (
        <>
          <div className="weather-main">
            <h2 style={{color:'white'}}>{weather.current?.temp || weather.temperature || '—'}°C</h2>
            <p style={{fontSize:'1.2rem',opacity:0.9}}>{weather.current?.description || weather.description || ''}</p>
            <p style={{opacity:0.8}}>{city} • Humidity: {weather.current?.humidity || weather.humidity || '—'}% • Wind: {weather.current?.wind_speed || weather.wind || '—'} km/h</p>
          </div>
          {weather.forecast && <div className="weather-grid">
            {weather.forecast.slice(0,4).map((d,i)=>(
              <div className="weather-day" key={i}>
                <p style={{fontWeight:700}}>{d.date || `Day ${i+1}`}</p>
                <h3>{d.temp || d.temperature || '—'}°C</h3>
                <p style={{color:'#666',fontSize:'0.85rem'}}>{d.description || ''}</p>
              </div>
            ))}
          </div>}
        </>
      )}
      {!weather && !loading && <div className="empty-state"><h3>Enter a city to see the weather</h3></div>}
    </div>
  );
};
export default WeatherForecast;
