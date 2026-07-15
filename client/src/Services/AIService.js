import axios from "axios";

const AI_URL = import.meta.env.VITE_API_URL.replace(
  "/api/weather",
  "/api/ai/weather-advice"
);

console.log("AI URL:", AI_URL);


export async function getAIAdvice(weather) {

  const response = await axios.post(AI_URL, {

    city: weather.city,

    temperature: weather.temperature,

    feelsLike: weather.feelsLike,

    humidity: weather.humidity,

    wind: weather.wind,

    condition: weather.condition,

  });


  return response.data.advice;

}