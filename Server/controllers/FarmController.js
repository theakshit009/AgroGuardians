import FarmRecord from "../models/FarmRecord.js";

// Create farm record
export const createFarmRecord = async (req, res) => {
  try {
    const { cropName, datePlanted } = req.body;

    const existingRecord = await FarmRecord.findOne({ 
      user: req.user._id, 
      cropName 
    });

    if (existingRecord) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a record for this crop" 
      });
    }
    
    const farmRecord = await FarmRecord.create({
      user: req.user._id,
      cropName,
      datePlanted
    });

    res.status(201).json({ success: true, data: farmRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all records of logged-in farmer
export const getMyFarmRecords = async (req, res) => {
  try {
    const records = await FarmRecord.find({ user: req.user._id });

    const recordsWithStats = records.map(record => {
      const totalExpenses = record.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const profit = record.revenue - totalExpenses;
      return { ...record._doc, totalExpenses, profit };
    });

    res.json({ success: true, count: recordsWithStats.length, data: recordsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single farm record
export const getFarmRecord = async (req, res) => {
  try {
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });

    if (record.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    const totalExpenses = record.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = record.revenue - totalExpenses;

    res.json({ success: true, data: { ...record._doc, totalExpenses, profit } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { description, amount } = req.body;
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    if (record.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    record.expenses.push({ description, amount });
    await record.save();

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update yield after harvest
export const updateYield = async (req, res) => {
  try {
    const { yield: totalYield } = req.body;
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    if (record.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    record.yield = totalYield;
    record.stockLeft = totalYield;
    await record.save();

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sell crop (update stockLeft and revenue)
export const sellCrop = async (req, res) => {
  try {
    const { quantity, price, buyer } = req.body;
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    if (record.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    if (quantity > record.stockLeft)
      return res.status(400).json({ success: false, message: "Not enough stock left" });

    record.stockLeft -= quantity;
    record.revenue += quantity * price;
    record.pricePerUnit = price; // latest selling price
    record.sold.push({ quantity, price, buyer });

    await record.save();

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete record
export const deleteFarmRecord = async (req, res) => {
  try {
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    if (record.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    await record.deleteOne();
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
