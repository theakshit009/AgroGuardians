import express from "express";
import "dotenv/config"
import cors from "cors";
import cron from "node-cron";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import farmRouter from "./routes/FarmRoutes.js";
import farmAnalyticsRouter from "./routes/farmAnalyticsRoutes.js";
import weatherRouter from "./routes/weatherRoutes.js";
import { sendDailyWeatherAlerts } from "./services/weatherAlert.js";
import cropRecommendationRouter from "./routes/cropRecommendationRoute.js";


const app = express();

// Initialize database connection (lazy connection for serverless)
let dbConnected = false;
const ensureDBConnection = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

//middleware
app.use(cors());
app.use(express.json());

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await ensureDBConnection();
  next();
});

// Only schedule cron jobs if NOT in serverless environment
if (process.env.VERCEL !== "1") {
  cron.schedule("59 22 * * *", async () => {
    console.log("⏰ Cron is working:", new Date().toLocaleString());
    await sendDailyWeatherAlerts();
  });
}

//routes
app.get("/", (req, res) => {
    res.send("api is working");
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/farms", farmRouter)
app.use("/api/analytics", farmAnalyticsRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/crop-recommendation", cropRecommendationRouter);

// Only start server if NOT in serverless environment (Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
export default app;