import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  getFarmSummary, 
  getCropReport, 
  getMonthlyReport 
} from "../controllers/farmAnalytics.js";

const farmAnalyticsRouter = express.Router();

// All routes protected (farmer or admin)
farmAnalyticsRouter.get("/summary", protect, getFarmSummary);
farmAnalyticsRouter.get("/report", protect, getCropReport);
farmAnalyticsRouter.get("/monthly/:month/:year", protect, getMonthlyReport);

export default farmAnalyticsRouter;
