import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL.replace(
  "/api/weather",
  "/api/ai/weather-advice"
);
console.log("AI URL:", API_URL);
export async function getAIAdvice(weather) {
  const response = await axios.post(API_URL, {
    city: weather.city,
    temperature: weather.temperature,
    feelsLike: weather.feelsLike,
    humidity: weather.humidity,
    wind: weather.wind,
    condition: weather.condition,
  });

  return response.data.advice;
}