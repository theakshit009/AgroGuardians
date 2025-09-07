import express from "express";
import {
  createFarmRecord,
  getMyFarmRecords,
  getFarmRecord,
  addExpense,
  updateYield,
  sellCrop,
  deleteFarmRecord
} from "../controllers/FarmController.js";
import { protect } from "../middleware/auth.js";

const farmRouter = express.Router();

// CRUD + Get all
farmRouter.route("/")
  .post(protect, createFarmRecord)  // Create
  .get(protect, getMyFarmRecords);  // Get all

farmRouter.route("/:id")
  .get(protect, getFarmRecord)      // Get one
  .delete(protect, deleteFarmRecord);

farmRouter.post("/:id/expenses", protect, addExpense);    // Add expense
farmRouter.put("/:id/yield", protect, updateYield);       // Update yield
farmRouter.post("/:id/sell", protect, sellCrop);          // Sell crop

export default farmRouter;
