const axios = require('axios');

/**
 * Fetch top agriculture news from NewsAPI
 * @returns {Array} Array of news articles
 */
const getAgricultureNews = async () => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'agriculture farming India',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name || 'Unknown'
    }));

    return articles;
  } catch (error) {
    throw new Error(`News API Error: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = { getAgricultureNews };
