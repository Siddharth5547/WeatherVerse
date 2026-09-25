import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Mic, MicOff, X, Clock, Sparkles, Command } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

const POPULAR_CITIES = ["London", "Tokyo", "New York", "Paris", "Dubai", "Mumbai", "Sydney", "Singapore"];

export default function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchCity, searchCoords, loading } = useWeather();
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wv_recent_searches") || "[]");
    } catch {
      return [];
    }
  });

  const recognitionRef = useRef(null);

  if (!isSearchOpen) return null;

  const saveRecent = (cityName) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      localStorage.setItem("wv_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (cityToSearch) => {
    const target = (cityToSearch || query).trim();
    if (!target) return;
    saveRecent(target);
    searchCity(target);
    setIsSearchOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setSpeechError("Geolocation is not supported by your browser.");
      setTimeout(() => setSpeechError(""), 3500);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        searchCoords(position.coords.latitude, position.coords.longitude);
        setIsSearchOpen(false);
      },
      () => {
        setSpeechError("Location access was denied. Please search manually.");
        setTimeout(() => setSpeechError(""), 3500);
      }
    );
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Voice search is not supported in this browser.");
      setTimeout(() => setSpeechError(""), 3500);
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError("");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setQuery(transcript);
        saveRecent(transcript);
        searchCity(transcript);
        setIsSearchOpen(false);
      };

      recognition.onerror = (event) => {
        setSpeechError(`Voice: ${event.error}`);
        setIsListening(false);
        setTimeout(() => setSpeechError(""), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-2.5 sm:px-4 overflow-y-auto box-border">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Apple Spotlight Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="apple-card relative w-full max-w-2xl p-3.5 sm:p-7 shadow-2xl z-10 my-4 max-h-[90vh] overflow-y-auto box-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] dark:text-[#8E8AFF] text-xs font-semibold uppercase tracking-wider">
              <Command size={14} /> Spotlight Search
            </div>
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] rounded text-[var(--text-muted)]">
                ESC to close
              </kbd>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
                aria-label="Close search dialog"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="mt-3 sm:mt-4 flex items-center gap-1 sm:gap-2 h-[48px] sm:h-[56px] min-h-[48px] px-2 sm:px-3 rounded-2xl border border-[var(--border-elevated)] bg-[var(--surface-card)] focus-within:border-[var(--accent-primary)] focus-within:ring-4 focus-within:ring-[#7A4F35]/15 transition-all shadow-xs w-full box-border">
            <Search size={18} className="text-[var(--accent-primary)] dark:text-[#8E8AFF] ml-0.5 sm:ml-1 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any global city..."
              className="w-full min-w-0 py-2 px-1 sm:px-1.5 bg-transparent text-sm sm:text-base outline-none font-medium placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="min-w-[30px] min-h-[30px] flex items-center justify-center p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition shrink-0 cursor-pointer"
                aria-label="Clear search input"
              >
                <X size={15} />
              </button>
            )}
            <button
              onClick={startVoiceSearch}
              className={`min-w-[34px] min-h-[34px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center p-1 sm:p-2 rounded-xl transition shrink-0 cursor-pointer ${
                isListening ? "bg-rose-500 text-white animate-pulse" : "text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
              }`}
              title="Voice Search"
              aria-label="Voice Search"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="apple-btn-primary !min-h-[36px] sm:!min-h-[40px] !px-3 sm:!px-4 !py-1 sm:!py-2 !text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          {speechError && (
            <p className="text-xs text-amber-600 mt-2 px-2">{speechError}</p>
          )}

          {/* Geolocation shortcut */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleLocationClick}
              className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] text-[#557659] dark:text-[#8EAD91] hover:bg-[#8EAD91]/10 transition"
            >
              <MapPin size={13} /> Detect My Current Location
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> Recent Searches
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem("wv_recent_searches");
                  }}
                  className="hover:text-rose-500 transition"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(city)}
                    className="px-3.5 py-1 rounded-full text-xs font-medium border border-[var(--border-subtle)] bg-[var(--surface-card-secondary)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] transition flex items-center gap-1.5"
                  >
                    <MapPin size={11} className="text-[var(--accent-primary)] dark:text-[#8E8AFF]" />
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Cities */}
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-semibold mb-2">
              <Sparkles size={12} className="text-[#D9B77A]" /> Popular Destinations
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSubmit(city)}
                  className="px-3.5 py-1 rounded-full text-xs font-medium border border-[var(--border-subtle)] bg-[var(--surface-card-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-primary)] transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
