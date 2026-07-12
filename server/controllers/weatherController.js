const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        message: "City or Location is required",
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    let url;

    if (lat && lon) {
      url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=yes&alerts=no`;
    } else {
      url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=yes&alerts=no`;
    }

    const response = await axios.get(url);

    const data = response.data;

    // Hourly Forecast
    const hourly = data.forecast.forecastday[0].hour.map((item) => ({
      time: new Date(item.time).toLocaleTimeString("en-IN", {
        hour: "numeric",
      }),
      temp: Math.round(item.temp_c),
      icon: "https:" + item.condition.icon,
    }));

    // Daily Forecast
    const daily = data.forecast.forecastday.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      temp: Math.round(item.day.avgtemp_c),
      icon: "https:" + item.day.condition.icon,
      condition: item.day.condition.text,
    }));

    res.json({
      city: data.location.name,

      temperature: Math.round(data.current.temp_c),

      feelsLike: Math.round(data.current.feelslike_c),

      condition: data.current.condition.text,

      description: data.current.condition.text,

      humidity: data.current.humidity,

      pressure: data.current.pressure_mb,

      visibility: data.current.vis_km,

      wind: Math.round(data.current.wind_kph),

      sunrise: data.forecast.forecastday[0].astro.sunrise,

      sunset: data.forecast.forecastday[0].astro.sunset,

      icon: "https:" + data.current.condition.icon,

      hourly,

      daily,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: error.response?.data?.error?.message || error.message,
    });
  }
};

module.exports = {
  getWeather,
};