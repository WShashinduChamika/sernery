import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type:String,
    },
    expiredAt:{
        type:Date,
    }
},{
    timestamps:true,
});

const BlackListToken = mongoose.model("BlackListToken",blackListTokenSchema);
export default BlackListToken;