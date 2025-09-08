import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique: true},
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["farmer", "expert", "admin", "buyer"], 
        default: "farmer" 
    },
    phone: { type: String, required: false },
    lat: { type: String, required: false },
    lon: { type: String, required: false }
});
const User = mongoose.model("User", userSchema);
export default User;