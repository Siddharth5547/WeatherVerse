import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

import { WeatherProvider, useWeather } from "./context/WeatherContext";
import WeatherEnvironment from "./components/WeatherEnvironment";
import Navbar from "./components/Navbar";
import GlobalSearchModal from "./components/GlobalSearchModal";
import Footer from "./components/Footer";

// The 8 Dedicated Pages
import HomePage from "./pages/HomePage";
import ForecastPage from "./pages/ForecastPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HourlyPage from "./pages/HourlyPage";
import AirQualityPage from "./pages/AirQualityPage";
import AIPage from "./pages/AIPage";
import LocationsPage from "./pages/LocationsPage";
import AboutPage from "./pages/AboutPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/weather" element={<AnalyticsPage />} />
          <Route path="/hourly" element={<HourlyPage />} />
          <Route path="/air-quality" element={<AirQualityPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function WeatherAppLayout() {
  const { weather, theme } = useWeather();

  return (
    <div
      className="min-h-screen relative transition-colors duration-700 flex flex-col justify-between text-[var(--text-primary)]"
    >
      {/* Living Atmospheric Simulation */}
      <WeatherEnvironment
        condition={weather?.condition}
        sunrise={weather?.sunrise}
        sunset={weather?.sunset}
      />

      {/* Global Universal Search Modal (Ctrl+K) */}
      <GlobalSearchModal />

      {/* Main Page Content Shell */}
      <div className="relative z-10 w-full flex flex-col flex-1 min-w-0">
        <Navbar />

        <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 flex-1 min-w-0">
          <AnimatedRoutes />
        </main>

        <Footer theme={theme} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <WeatherProvider>
        <WeatherAppLayout />
      </WeatherProvider>
    </BrowserRouter>
  );
}
