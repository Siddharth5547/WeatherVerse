import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { fetchWeather, fetchWeatherByLocation } from "../Services/WeatherService";
import { getAIAdvice } from "../Services/AIService";

const WeatherContext = createContext();

const DEFAULT_SAVED = [
  { city: "London", temp: 17, condition: "Overcast", icon: "https://cdn.weatherapi.com/weather/64x64/day/122.png", high: 19, low: 14 },
  { city: "Tokyo", temp: 22, condition: "Sunny", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png", high: 24, low: 18 },
  { city: "New York", temp: 19, condition: "Partly Cloudy", icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png", high: 21, low: 15 },
  { city: "Paris", temp: 18, condition: "Clear", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png", high: 20, low: 13 },
];

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);
  const weatherRef = useRef(null);
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [aiAdvice, setAIAdvice] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem("wv_unit") || "C";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("wv_theme") || "dark";
  });

  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      const stored = localStorage.getItem("wv_saved_locations");
      return stored ? JSON.parse(stored) : DEFAULT_SAVED;
    } catch {
      return DEFAULT_SAVED;
    }
  });

  // Keep weatherRef updated
  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem("wv_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Sync unit
  useEffect(() => {
    localStorage.setItem("wv_unit", unit);
  }, [unit]);

  // Sync saved locations
  useEffect(() => {
    localStorage.setItem("wv_saved_locations", JSON.stringify(savedLocations));
  }, [savedLocations]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  // Centralized AI Advice Generation (STABLE CALLBACK)
  const askAI = useCallback(async (customPrompt = null, currentWeatherData = null) => {
    const dataToUse = currentWeatherData || weatherRef.current;
    if (!dataToUse) return;

    try {
      setAILoading(true);
      if (customPrompt) {
        setAiChatHistory((prev) => [...prev, { role: "user", text: customPrompt }]);
      }

      const advice = await getAIAdvice(dataToUse, customPrompt);
      setAIAdvice(advice);

      if (customPrompt) {
        setAiChatHistory((prev) => [...prev, { role: "assistant", text: advice }]);
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      setAIAdvice("WeatherVerse AI copilot is currently synchronizing atmospheric telemetry.");
    } finally {
      setAILoading(false);
    }
  }, []);

  // Search by city (STABLE CALLBACK)
  const searchCity = useCallback(async (cityName) => {
    const target = (cityName || "").trim();
    if (!target) return;

    try {
      setLoading(true);
      setError("");
      const data = await fetchWeather(target);
      weatherRef.current = data;
      setWeather(data);
      setCity(data.city);

      // Auto consult AI for the new city
      askAI(null, data);
    } catch (err) {
      console.error(err);
      setError(err.message || `Unable to retrieve forecast for "${target}".`);
    } finally {
      setLoading(false);
    }
  }, [askAI]);

  // Search by coordinates (STABLE CALLBACK)
  const searchCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchWeatherByLocation(lat, lon);
      weatherRef.current = data;
      setWeather(data);
      setCity(data.city);
      askAI(null, data);
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve weather for your coordinates.");
    } finally {
      setLoading(false);
    }
  }, [askAI]);

  // Toggle saving location
  const toggleSaveLocation = (locData) => {
    const targetCity = locData?.city || city;
    setSavedLocations((prev) => {
      const exists = prev.some((item) => item.city.toLowerCase() === targetCity.toLowerCase());
      if (exists) {
        return prev.filter((item) => item.city.toLowerCase() !== targetCity.toLowerCase());
      } else {
        const newLoc = {
          city: targetCity,
          temp: locData?.temperature ?? weatherRef.current?.temperature ?? 20,
          condition: locData?.condition ?? weatherRef.current?.condition ?? "Clear",
          icon: locData?.icon ?? weatherRef.current?.icon ?? "https://cdn.weatherapi.com/weather/64x64/day/113.png",
          high: (locData?.temperature ?? weatherRef.current?.temperature ?? 20) + 3,
          low: (locData?.temperature ?? weatherRef.current?.temperature ?? 20) - 3,
        };
        return [newLoc, ...prev];
      }
    });
  };

  const isSaved = (cityName) => {
    const target = cityName || city;
    return savedLocations.some((item) => item.city.toLowerCase() === target.toLowerCase());
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initial city load: runs exactly once
  const initialMountRef = useRef(false);
  useEffect(() => {
    if (!initialMountRef.current) {
      initialMountRef.current = true;
      searchCity("London");
    }
  }, [searchCity]);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        city,
        loading,
        error,
        setError,
        unit,
        theme,
        toggleTheme,
        toggleUnit,
        searchCity,
        searchCoords,
        savedLocations,
        toggleSaveLocation,
        isSaved,
        aiAdvice,
        aiLoading,
        aiChatHistory,
        askAI,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
