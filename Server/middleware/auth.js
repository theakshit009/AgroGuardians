import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect=async (req,res,next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from decoded.id
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
    } catch (error) {
        return res.json({success:false,message:"Not-Authorized"})
    }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource"
      });
    }
    next();
  };
};
