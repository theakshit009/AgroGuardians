import FarmRecord from "../models/FarmRecord.js";

// Overall Summary (Revenue, Expenses, Profit)
export const getFarmSummary = async (req, res) => {
  try {
    const records = await FarmRecord.find({ user: req.user._id });

    let totalRevenue = 0;
    let totalExpenses = 0;

    records.forEach(record => {
      const recordExpenses = record.expenses.reduce((sum, e) => sum + e.amount, 0);
      totalExpenses += recordExpenses;
      totalRevenue += record.revenue;
    });

    res.json({
      success: true,
      totalRevenue,
      totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Crop-wise Report
export const getCropReport = async (req, res) => {
  try {
    const records = await FarmRecord.find({ user: req.user._id });

    const report = records.map(record => {
      const recordExpenses = record.expenses.reduce((sum, e) => sum + e.amount, 0);
      const profit = record.revenue - recordExpenses;

      return {
        cropName: record.cropName,
        yield: record.yield,
        stockLeft: record.stockLeft,
        revenue: record.revenue,
        expenses: recordExpenses,
        profit,
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3️⃣ Monthly Report
export const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.params;
    const records = await FarmRecord.find({ user: req.user._id });

    let monthlyRevenue = 0;
    let monthlyExpenses = 0;

    records.forEach(record => {
      // Filter sold crops for that month
      record.sold.forEach(sale => {
        const saleDate = new Date(sale.date || record.updatedAt);
        if (saleDate.getMonth() + 1 == month && saleDate.getFullYear() == year) {
          monthlyRevenue += sale.quantity * sale.price;
        }
      });

      // Filter expenses for that month
      record.expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() + 1 == month && expenseDate.getFullYear() == year) {
          monthlyExpenses += expense.amount;
        }
      });
    });

    res.json({
      success: true,
      month,
      year,
      revenue: monthlyRevenue,
      expenses: monthlyExpenses,
      profit: monthlyRevenue - monthlyExpenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
