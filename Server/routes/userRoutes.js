import express from "express"
import { authorize, protect } from "../middleware/auth.js";
import User from "../models/User.js";

const userRouter = express.Router();

// GET all users (admin only)
userRouter.get("/",protect,authorize("admin"),async (req,res)=> {
    const users =await User.find().select("-password");
    res.json(users);
})

// GET single user profile
userRouter.get("/:id", protect, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

// UPDATE user (self or admin)
userRouter.put("/:id", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not allowed" });
  }
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
  res.json(updated);
});
// DELETE user (admin only)
userRouter.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
});

export default userRouter;