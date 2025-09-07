import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const saleSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  buyer: { type: String }
}, { _id: false });

const farmRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cropName: { type: String, required: true },
  datePlanted: { type: Date, required: true },
  dateHarvested: { type: Date },
  yield: { type: Number, default: 0 },       // total produced
  stockLeft: { type: Number, default: 0 },   // remaining crop
  expenses: [expenseSchema],
  revenue: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 },
  sold: { type: [saleSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("FarmRecord", farmRecordSchema);
