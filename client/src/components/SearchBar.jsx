import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Mic, MicOff, X, Clock, Sparkles } from "lucide-react";

const POPULAR_CITIES = ["London", "Tokyo", "New York", "Paris", "Dubai", "Mumbai", "Sydney"];

export default function SearchBar({ onSearch, onLocationSearch, theme, loading }) {
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
  const [showDropdown, setShowDropdown] = useState(false);

  const recognitionRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecent = (cityName) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("wv_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (cityToSearch) => {
    const target = (cityToSearch || query).trim();
    if (!target) return;
    saveRecent(target);
    onSearch(target);
    setShowDropdown(false);
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
        onLocationSearch(position.coords.latitude, position.coords.longitude);
        setShowDropdown(false);
      },
      (err) => {
        console.warn("Geolocation permission error:", err);
        setSpeechError("Location access was denied. Please search your city manually.");
        setTimeout(() => setSpeechError(""), 4000);
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
        onSearch(transcript);
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission denied.");
        } else if (event.error === "no-speech") {
          setSpeechError("No voice detected. Please try again.");
        } else {
          setSpeechError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setSpeechError(""), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mb-8 z-30">
      {/* Search Input Bar */}
      <div
        className={`relative flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300 border shadow-lg ${
          theme === "dark"
            ? "bg-slate-900/80 border-slate-700/80 focus-within:border-cyan-400 focus-within:shadow-cyan-500/10"
            : "bg-white border-slate-200 focus-within:border-cyan-500 focus-within:shadow-cyan-500/15"
        }`}
      >
        <div className="pl-3.5 text-cyan-400">
          <Search size={20} className={loading ? "animate-spin text-cyan-400" : ""} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search any city or postal code worldwide..."
          className={`w-full py-2.5 px-2 bg-transparent text-sm md:text-base outline-none font-medium ${
            theme === "dark"
              ? "text-white placeholder:text-slate-500"
              : "text-slate-900 placeholder:text-slate-400"
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            }`}
            title="Clear input"
          >
            <X size={16} />
          </button>
        )}

        {/* Voice Search Button */}
        <button
          onClick={startVoiceSearch}
          className={`relative p-2.5 rounded-xl transition-all ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : theme === "dark"
              ? "text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
              : "text-slate-500 hover:text-cyan-600 hover:bg-slate-100"
          }`}
          title="Voice Search"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          {isListening && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>

        {/* Geolocation Button */}
        <button
          onClick={handleLocationClick}
          className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
            theme === "dark"
              ? "text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20"
              : "text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200"
          }`}
          title="Detect Current Location"
        >
          <MapPin size={16} />
          <span className="hidden sm:inline">My Location</span>
        </button>

        {/* Search Submit Button */}
        <button
          onClick={() => handleSubmit()}
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          {loading ? "Searching..." : "Explore"}
        </button>
      </div>

      {/* Speech / Permission Notice */}
      <AnimatePresence>
        {speechError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute -top-10 left-0 right-0 mx-auto w-max px-3 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md"
          >
            {speechError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Menu (Recent Searches) */}
      <AnimatePresence>
        {showDropdown && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`absolute left-0 right-0 mt-2 p-3 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 ${
              theme === "dark"
                ? "bg-slate-900/95 border-slate-700/80 text-white"
                : "bg-white/95 border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-700/30 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> Recent Searches
              </span>
              <button
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem("wv_recent_searches");
                }}
                className="hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {recentSearches.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(city);
                    handleSubmit(city);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    theme === "dark"
                      ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  <MapPin size={11} className="text-cyan-400" />
                  {city}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick City Pills Bar */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none pb-1 text-xs">
        <span
          className={`flex items-center gap-1 shrink-0 font-semibold uppercase tracking-wider text-[11px] ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <Sparkles size={11} className="text-cyan-400" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            onClick={() => {
              setQuery(city);
              saveRecent(city);
              onSearch(city);
            }}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              theme === "dark"
                ? "bg-slate-900/60 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/50"
                : "bg-white/80 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200 hover:border-cyan-300 shadow-sm"
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
