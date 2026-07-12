import "./App.css";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

import {
  fetchWeather,
  fetchWeatherByLocation,
} from "./Services/WeatherService";

function getBackground(condition) {
  switch (condition) {
    case "Clear":
      return "from-cyan-400 via-sky-500 to-blue-700";

    case "Clouds":
      return "from-slate-500 via-slate-700 to-slate-900";

    case "Rain":
    case "Drizzle":
      return "from-slate-900 via-blue-900 to-indigo-950";

    case "Thunderstorm":
      return "from-purple-950 via-slate-950 to-black";

    case "Snow":
      return "from-sky-100 via-cyan-200 to-blue-300";

    case "Mist":
    case "Fog":
    case "Haze":
      return "from-gray-300 via-slate-500 to-slate-800";

    default:
      return "from-slate-950 via-blue-950 to-indigo-950";
  }
}

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  async function handleSearch(city) {
    try {
      setLoading(true);
      setError("");

      const data = await fetchWeather(city);

      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError("❌ City not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleLocationSearch(lat, lon) {
    try {
      setLoading(true);
      setError("");

      const data = await fetchWeatherByLocation(lat, lon);

      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError("❌ Unable to fetch location weather");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-700 flex justify-center items-center px-5 py-8
      ${
        theme === "dark"
          ? `bg-gradient-to-br ${getBackground(weather?.condition)}`
          : "bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-200"
      }`}
    >
      <div className="w-full max-w-xl">

        <Header
          theme={theme}
          darkMode={theme === "dark"}
          toggleTheme={toggleTheme}
        />

        <SearchBar
        onSearch={handleSearch}
        onLocationSearch={handleLocationSearch}
        theme={theme}
        />

        {loading && (
          <div className="text-center mt-8">
            <div className="loader mx-auto"></div>

            <p
              className={`mt-4 ${
                theme === "dark"
                  ? "text-gray-300"
                  : "text-slate-700"
              }`}
            >
              Fetching Weather...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-400 rounded-xl mt-6 p-4">
            <p className="text-red-300 text-center">
              {error}
            </p>
          </div>
        )}

        {!loading && weather && (
          <WeatherCard
            {...weather}
            theme={theme}
          />
        )}

      </div>
    </div>
  );
}

export default App;