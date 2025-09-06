import express from "express";
import "dotenv/config"
import cors from "cors";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";


const app = express();

await connectDB();
//middleware
app.use(cors());
app.use(express.json());


//routes
app.get("/", (req, res) => {
    res.send("api is working");
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

export default app;