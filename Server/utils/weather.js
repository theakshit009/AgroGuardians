// utils/weather.js
import axios from "axios";

// Mapping weather codes → text (from Open-Meteo docs)
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy rain showers",
  95: "Thunderstorm",
  99: "Severe thunderstorm"
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "weather_code",
          "wind_speed_10m"
        ],
        hourly: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "wind_speed_10m"
        ],
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum"
        ],
        timezone: "auto",
        alerts: "true"
      }
    });

    return res.data; 
  } catch (err) {
    console.error("❌ Weather API error:", err.message);
    return null;
  }
};

