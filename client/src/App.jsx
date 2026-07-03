import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

function App() {
  return (
    <div>
      <Header />
      <SearchBar />
         <WeatherCard
          city="Delhi"
          temperature={32}
          condition="Clear Sky"
          humidity={65}
          wind={12}
          />
    </div>
  );
}

export default App;