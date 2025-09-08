import express from "express";
import {  getWeather } from "../controllers/weatherController.js";
import { protect } from "../middleware/auth.js"; // optional if auth required

const weatherRouter = express.Router();

weatherRouter.get("/", getWeather);


export default weatherRouter;
