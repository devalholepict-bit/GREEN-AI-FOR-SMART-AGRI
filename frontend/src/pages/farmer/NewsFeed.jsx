import React, { useState, useEffect } from 'react';
import backendAPI from '../../api/axios';
import '../../styles/Dashboard.css';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => { setLoading(true); try { const r = await backendAPI.get('/marketplace/news'); setArticles(r.data.articles||[]); } catch{} finally{setLoading(false);} };
  useEffect(() => { fetchNews(); }, []);

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
        <div><h1>📰 Agriculture News</h1><p>Stay updated with the latest agriculture news.</p></div>
        <button className="btn btn-outline" onClick={fetchNews}>Refresh</button>
      </div>
      {loading ? <div className="loading-state"><div className="loading-spinner"></div><p>Fetching news...</p></div> :
      articles.length === 0 ? <div className="empty-state"><h3>No articles found</h3></div> :
      <div className="news-grid">
        {articles.map((a, i) => (
          <div className="news-card" key={i}>
            {a.urlToImage && <img src={a.urlToImage} alt={a.title} onError={e=>{e.target.style.display='none'}}/>}
            <div className="news-card-body">
              <h3>{a.title}</h3>
              <p className="meta">{a.author || 'Unknown'} • {new Date(a.publishedAt).toLocaleDateString()}</p>
              <a href={a.url} target="_blank" rel="noopener noreferrer">Read More →</a>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};
export default NewsFeed;
