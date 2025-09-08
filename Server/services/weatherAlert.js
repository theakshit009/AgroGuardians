import User from "../models/User.js";
import { sendSMS } from "../utils/sms.js";
import { fetchWeatherData } from "../utils/weather.js";

export const sendDailyWeatherAlerts = async () => {
  try {

    const farmers = await User.find({ role: "farmer", phone: { $exists: true } });
    console.log("Found farmers:", farmers.length);

    for (let farmer of farmers) {
      console.log("Checking farmer:", farmer.name, farmer.phone, farmer.lat, farmer.lon);

      if (!farmer.lat || !farmer.lon) {
        console.log("Skipping farmer due to missing lat/lon");
        continue;
      }

      const data = await fetchWeatherData(farmer.lat, farmer.lon);
      console.log("Weather data fetched:", !!data);

      if (!data) continue;

      let msg = `🌦 Good Morning ${farmer.name}!
🌡 Temp: ${data.current.temperature_2m}°C 
(min ${data.daily.temperature_2m_min[0]}°C, max ${data.daily.temperature_2m_max[0]}°C)
💧 Humidity: ${data.current.relative_humidity_2m}%
🌧 Rain today: ${data.daily.precipitation_sum[0]}mm
💨 Wind: ${data.current.wind_speed_10m} km/h`;

      if (data.alerts && data.alerts.length > 0) {
        const alert = data.alerts[0];
        msg += `\n Alert: ${alert.event} - ${alert.description}`;
      }

      await sendSMS(farmer.phone, msg);
      console.log(`SMS sent to ${farmer.phone}`);
    }
  } catch (err) {
    console.error("❌ Error sending weather alerts:", err.message);
  }
};
