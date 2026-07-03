function WeatherCard(props) {
  return (
    <div>
      <h2>📍 {props.city}</h2>

      <p>🌡️ Temperature : {props.temperature}°C</p>

      <p>☁️ Condition : {props.condition}</p>

      <p>💧 Humidity : {props.humidity}%</p>

      <p>💨 Wind : {props.wind} km/h</p>
    </div>
  );
}

export default WeatherCard;