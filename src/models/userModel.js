import mongoose from "mongoose";
import { userRoles } from "../utils/enum/userRole.js";

const userSchema = new mongoose.Schema({
    userRole:{
        type:String,
        enum: [userRoles.ADMIN.value,userRoles.USER.value],
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    contactNumber:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true,
});

const User = mongoose.model("User",userSchema);
export default User;