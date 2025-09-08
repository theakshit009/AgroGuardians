import express from "express";
import { protect } from "../middleware/auth.js";  
import axios from "axios";

const cropRecommendationRouter = express.Router();

cropRecommendationRouter.post("/", protect, async (req, res) => {
    try {
        const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

        if (
            N === undefined || P === undefined || K === undefined ||
            temperature === undefined || humidity === undefined ||
            ph === undefined || rainfall === undefined
        ) {
            return res.status(400).json({ success: false, message: "All input fields are required" });
        }

        const { data } = await axios.post("https://crop-api-2-mg7c.onrender.com/predict", {
            N, P, K, temperature, humidity, ph, rainfall
        });

        res.json({ success: true, recommendation: data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch crop recommendation",
            error: error.response?.data || error.message
        });
    }
});

export default cropRecommendationRouter;
