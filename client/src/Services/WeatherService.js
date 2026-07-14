import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export const fetchWeather = async (city) => {
  const response = await axios.get(`${API_URL}?city=${city}`);
  return response.data;
};

export const fetchWeatherByLocation = async (lat, lon) => {
  const response = await axios.get(`${API_URL}?lat=${lat}&lon=${lon}`);
  return response.data;
};