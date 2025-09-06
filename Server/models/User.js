import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique: true},
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["farmer", "expert", "admin", "buyer"], 
        default: "farmer" 
    }
});
const User = mongoose.model("User", userSchema);
export default User;