import { fetchWeatherData } from "../utils/weather.js";

// Current + hourly + daily + India alerts
export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: "lat & lon required" });
    }

    const data = await fetchWeatherData(lat, lon);

    res.json({
      success: true,
      current: data.current,
      hourly: data.hourly,
      daily: data.daily,
      alerts:data.alerts || []
    });
  } catch (error) {
    console.error("Error in getWeather:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch weather and alerts" });
  }
};
