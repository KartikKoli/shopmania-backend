import mongoose from "mongoose";
import { createCartForUser } from "../utilities/modelHelper.js";
import { hashPassword } from "../utilities/hash.js";
import compPassword from "../utilities/comparePasswords.js";

const userSchema=new mongoose.Schema({
    "username": {
        type: String,
        require: true,
        minLength: [6,"Username must have atleast 6 characters"],
        maxLength: [20,"Username cannot exceed 20 characters"]
    },
    "email": {
        type: String,
        required: true,
        unique: true
    },
    "password":{
        type: String,
        required: true,
        select: false
    },
    "confirmPassword":{
        type: String,
        minLength: [8,"Password must have atleast 8 characters"],
        maxLength: [20,"Password cannot exceed 20 characters"],
        select: false
    },
    "address":{
        houseNo: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, default: "India" }
    },
    "cartId":{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    },
    role:{
        type: String,
        enum: ["user","admin"],
        default: "user"
    }
},{timestamps:true});

userSchema.post("save", async function (){
    await createCartForUser(this);
});

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return;
    await hashPassword(this);
})

userSchema.methods.comparePassword=async function(enteredPassword){
    return await compPassword(this.password,enteredPassword);
}

export default mongoose.model("User",userSchema);