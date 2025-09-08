import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    verifyOTP:{
        type:String,
        default:'',
        
    },

    verifyOTPExpireAt:{
        type:Number,
        defalut:0
    },
    isAccountVerified:{
        type:Boolean,
        dafault:false
    },
    resetOTP:{
        type:String,
        default:""
    },
    resetOTPExpireAt:{
        type:Number,
        defalut:0
    },
})

const userModel=mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;

