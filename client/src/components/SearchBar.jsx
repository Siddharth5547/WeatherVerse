import { useState, useRef } from "react";

function SearchBar({
  onSearch,
  onLocationSearch,
  theme,
}) {
  const [city, setCity] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  function handleSearch() {
    if (!city.trim()) return;
    onSearch(city.trim());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSearch(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        alert("Location permission denied.");
      }
    );
  }

  function startVoiceSearch() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice Search is not supported.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();

      setCity(transcript);

      setTimeout(() => {
        onSearch(transcript);
      }, 100);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        alert("Please allow microphone permission.");
      }

      if (event.error === "no-speech") {
        alert("No speech detected.");
      }

      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }

  return (
    <div className="space-y-4 w-full">

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-center">

        <input
          type="text"
          placeholder="🔍 Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-2xl px-5 py-3 outline-none border backdrop-blur-lg transition-all duration-300
          ${
            theme === "dark"
              ? "bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 shadow-md"
          }`}
        />

        <button
          onClick={handleSearch}
          className="w-full sm:w-auto whitespace-nowrap rounded-2xl bg-cyan-500 px-6 py-3 text-white font-semibold hover:bg-cyan-600 transition"
        >
          Search
        </button>

        <button
          onClick={startVoiceSearch}
          disabled={listening}
          title="Voice Search"
          className={`w-full sm:w-[60px] h-[52px]
          rounded-2xl
          flex items-center justify-center
          border transition-all duration-300
          ${
            listening
              ? "bg-red-500 text-white animate-pulse cursor-not-allowed"
              : theme === "dark"
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : "bg-white border-slate-300 text-slate-900 hover:bg-slate-100 shadow-md"
          }`}
        >
          {listening ? "🎙️" : "🎤"}
        </button>
      </div>
            {listening && (
        <div
          className={`text-center rounded-xl py-2 px-4 font-semibold animate-pulse ${
            theme === "dark"
              ? "bg-red-500/20 text-red-300"
              : "bg-red-100 text-red-600"
          }`}
        >
          🎙 Listening...
        </div>
      )}

      <button
        onClick={handleLocation}
        className={`w-full rounded-2xl py-3 font-semibold border transition-all duration-300
        ${
          theme === "dark"
            ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
            : "bg-white border-slate-300 text-slate-900 hover:bg-slate-100 shadow-md"
        }`}
      >
        📍 Use My Current Location
      </button>

    </div>
  );
}

export default SearchBar;