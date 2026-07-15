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



    // DEBUG AQI DATA
    console.log(
      "AIR QUALITY DATA:",
      data.current.air_quality
    );





    // Hourly Forecast
    const hourly = data.forecast.forecastday[0].hour.map((item) => ({

      time: new Date(item.time).toLocaleTimeString("en-IN", {
        hour: "numeric",
      }),

      temp: Math.round(item.temp_c),

      icon: "https:" + item.condition.icon,

      condition: item.condition.text,

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







    // AQI Data

    const air = data.current.air_quality || {};


    const aqi = {

      index: air["us-epa-index"] || 0,

      pm25: Math.round(air.pm2_5 || 0),

      pm10: Math.round(air.pm10 || 0),

      co: Math.round(air.co || 0),

      no2: Math.round(air.no2 || 0),

      o3: Math.round(air.o3 || 0),

    };







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



      // AQI
      aqi,



      hourly,


      daily,

    });



  } catch (error) {


    console.log(
      "ERROR:",
      error.response?.data || error.message
    );


    res.status(500).json({

      message:
        error.response?.data?.error?.message ||
        error.message,

    });


  }
};



module.exports = {
  getWeather,
};