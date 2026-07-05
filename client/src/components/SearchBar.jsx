import { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  function handleSearch() {
    if (city.trim() !== "") {
      onSearch(city);
    }
  }

  return (
    <div className="flex gap-3 mb-8">

      <input
        type="text"
        placeholder="🔍 Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-xl font-semibold transition duration-300"
      >
        Search
      </button>

    </div>
  );
}

export default SearchBar;