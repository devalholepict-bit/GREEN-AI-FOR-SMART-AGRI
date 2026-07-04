const axios = require('axios');

/**
 * Get weather forecast for a city
 * @param {String} city - City name
 * @returns {Object} Weather data with 4-day forecast
 */
const getWeatherForecast = async (city) => {
  try {
    // Get current weather
    const currentResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric'
      }
    });

    // Get 5-day/3-hour forecast (we'll extract 4 days)
    const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const currentWeather = {
      city: currentResponse.data.name,
      country: currentResponse.data.sys?.country,
      temperature: currentResponse.data.main.temp,
      feels_like: currentResponse.data.main.feels_like,
      humidity: currentResponse.data.main.humidity,
      description: currentResponse.data.weather[0]?.description,
      icon: currentResponse.data.weather[0]?.icon,
      wind_speed: currentResponse.data.wind?.speed,
      pressure: currentResponse.data.main.pressure
    };

    // Extract one forecast per day (noon readings) for next 4 days
    const dailyForecasts = [];
    const seenDates = new Set();

    for (const item of forecastResponse.data.list) {
      const date = item.dt_txt.split(' ')[0];
      const hour = item.dt_txt.split(' ')[1];

      // Take the noon reading for each day
      if (!seenDates.has(date) && hour === '12:00:00' && dailyForecasts.length < 4) {
        seenDates.add(date);
        dailyForecasts.push({
          date: date,
          temperature: item.main.temp,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          description: item.weather[0]?.description,
          icon: item.weather[0]?.icon,
          wind_speed: item.wind?.speed
        });
      }
    }

    return {
      current: currentWeather,
      forecast: dailyForecasts
    };
  } catch (error) {
    throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = { getWeatherForecast };
