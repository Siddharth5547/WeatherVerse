import { useState } from "react";

function SearchBar() {
  const [city, setCity] = useState("");

  function handleSearch() {
  console.log(city);
}

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
       <button onClick={handleSearch}> Get Weather  </button>
    </div>
  );
}

export default SearchBar;