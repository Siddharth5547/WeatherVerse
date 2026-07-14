import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchWeather = async (city, lat, lon) => {
  let url = API_URL;

  if (city) {
    url += `?city=${city}`;
  } else {
    url += `?lat=${lat}&lon=${lon}`;
  }

  const res = await axios.get(url);
  return res.data;
};