import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://weatherverse-backend.vercel.app/api/weather";
const AI_URL = BASE_URL.replace("/api/weather", "/api/ai/weather-advice");

/**
 * Intelligent Weather Advice Generator
 * Calls backend Gemini API or provides rich contextual meteorological synthesis
 */
export async function getAIAdvice(weather, customQuery = null) {
  if (!weather) return "";

  try {
    const response = await axios.post(
      AI_URL,
      {
        city: weather.city,
        temperature: weather.temperature,
        feelsLike: weather.feelsLike,
        humidity: weather.humidity,
        wind: weather.wind,
        condition: weather.condition,
        query: customQuery || undefined,
      },
      { timeout: 15000 }
    );

    if (response.data && response.data.advice) {
      // If user had a specific query, personalize the advice
      if (customQuery) {
        return synthesizeCustomResponse(customQuery, weather, response.data.advice);
      }
      return response.data.advice;
    }
  } catch (err) {
    console.warn("Backend AI request failed, utilizing local meteorological synthesis engine:", err.message);
  }

  // Fallback intelligent weather-aware generator
  const contextual = generateContextualAdvice(weather, customQuery);
  if (customQuery) {
    return synthesizeCustomResponse(customQuery, weather, contextual);
  }
  return contextual;
}

function synthesizeCustomResponse(query, weather, rawAdvice) {
  const q = query.toLowerCase();
  const cond = (weather.condition || "").toLowerCase();
  const isRain = cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower");
  const temp = weather.temperature;

  if (q.includes("umbrella")) {
    if (isRain) {
      return `### ☔ Umbrella Advisory: **Yes, Definitely!**\n\nWith **${weather.condition}** reported in ${weather.city} and humidity at **${weather.humidity}%**, precipitation is imminent or occurring. Carry a compact storm-resistant umbrella.\n\n* **Live Insight:** ${rawAdvice.slice(0, 160)}...`;
    }
    return `### 🌂 Umbrella Advisory: **No Umbrella Needed**\n\nCurrently, ${weather.city} has **${weather.condition}** with stable conditions. Precipitation probability is low today, so you can travel light without rain gear.`;
  }

  if (q.includes("run") || q.includes("running") || q.includes("jog")) {
    const aqiGood = !weather.aqi || weather.aqi.index <= 2;
    if (temp >= 12 && temp <= 25 && !isRain && aqiGood) {
      return `### 🏃‍♂️ Running Condition: **Optimal & Energizing!**\n\n- **Temperature:** ${temp}°C (ideal thermal comfort)\n- **Air Quality:** ${weather.aqi ? 'US EPA Index ' + weather.aqi.index + ' (Good)' : 'Favorable'}\n- **Recommendation:** Great window for high-cadence outdoor cardio or a 5K route. Stay hydrated!`;
    }
    return `### 🏃 Running Condition: **Exercise Caution**\n\n- **Conditions:** ${weather.condition}, ${temp}°C\n- **Advisory:** ${isRain ? 'Wet pavement poses slipping risk.' : temp > 28 ? 'High heat strain — hydrate frequently.' : 'Dress warmly in moisture-wicking layers.'}`;
  }

  if (q.includes("wear") || q.includes("clothing") || q.includes("dress")) {
    let clothing = "Comfortable everyday cotton layers.";
    if (temp < 10) clothing = "Thermal innerwear, insulated jacket, and fleece gloves.";
    else if (temp < 18) clothing = "A lightweight sweater, denim jacket, or windbreaker.";
    else if (temp > 28) clothing = "Breathable linen, light fabrics, and UV-filtering sunglasses.";

    return `### 🧥 Wardrobe Recommendation for ${weather.city}\n\n- **Primary Outfit:** ${clothing}\n- **Thermal Context:** It's ${temp}°C outside (feels like ${weather.feelsLike}°C with ${weather.wind} km/h wind).\n- **Accessories:** ${isRain ? "Waterproof footwear and rain shell." : "Sunglasses and SPF protection."}`;
  }

  return rawAdvice;
}

function generateContextualAdvice(weather, _customQuery) {
  const { city, temperature, feelsLike, humidity, wind, condition, aqi } = weather;
  const isRain = /rain|drizzle|shower|thunderstorm/i.test(condition);
  const isCold = temperature < 14;
  const isHot = temperature > 28;

  let advice = `### 🌤️ Weather Report for **${city}**\n\n`;
  advice += `Current atmospheric status indicates **${condition}** at **${temperature}°C** (feels like **${feelsLike}°C**), accompanied by winds of **${wind} km/h** and **${humidity}%** relative humidity.\n\n`;

  advice += `**Key Directives:**\n`;
  if (isRain) {
    advice += `* **Precipitation Alert:** Active rain systems detected. Carry a sturdy umbrella and prefer waterproof outerwear.\n`;
  } else if (isHot) {
    advice += `* **Heat Management:** Warm temperatures prevail. Maintain hydration and apply broad-spectrum sunscreen if outdoors.\n`;
  } else if (isCold) {
    advice += `* **Thermal Layering:** Crisp temperatures call for an insulated jacket or thermal layering.\n`;
  } else {
    advice += `* **Comfort Level:** Mild and pleasant weather for both indoor and outdoor endeavors.\n`;
  }

  if (aqi && aqi.index) {
    const aqiLabels = ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"];
    advice += `* **Air Quality Rating:** ${aqiLabels[aqi.index - 1] || "Moderate"} (PM2.5: ${aqi.pm25} µg/m³).\n`;
  }

  advice += `* **Outdoor Activity:** ${isRain ? "Indoor workouts or covered venues recommended." : "Favorable conditions for commuting, running, or dining outside."}`;

  return advice;
}