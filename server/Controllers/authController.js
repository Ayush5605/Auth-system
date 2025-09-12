import bcrypt from'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import userModel from '../Models/userModels.js';
import transporter from "../config/NodeMailer.js";




export const register=async(req,res)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success:false,message:'Missing details'});
    }

    try{

        const existingUser=await userModel.findOne({email})

        if(existingUser){
            return res.json({success:false,message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);


        const user=new userModel({
            name,email,password:hashedPassword
        })

        await user.save();


        const token=jsonwebtoken.sign({id:user._id},
            process.env.JWT_SECRET,{expiresIn:'7d'});

            res.cookie('token',token , {
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:process.env.NODE_ENV==='production'?
                'none':'strict',
                maxAge:7*24*60*60*1000,
            });
            //sending welcome mail
            const mailOptions={
                from:process.env.SENDER_EMAIL,
                to:email,
                subject:'Welcome to our Ayush authentication system',
                text:`Welcome we are glad that now you are part of Ayush Autis organisation and your account has been
                successfully created with emailID:${email}`
            }

          await transporter.sendMail(mailOptions)
           .then(info => console.log("✅ Sent:", info.messageId))
           .catch(err => console.error("❌ Error:", err));

             return res.json({success:true,userData:{
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified
             }});


    }catch(err){
        res.json({success:false,message:err.message})
    }

}

export const login=async(req,res)=>{
    const{email,password}=req.body;

    if(!email || !password){
        return res.json({success:false,message:"Email and password are mandatory!"})
    }

    try{
        const user=await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User doesn't exist"});
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:"Invalid password!"});

        
        }

        const token=jsonwebtoken.sign({id:user._id},
            process.env.JWT_SECRET,{expiresIn:'7d'});

            res.cookie('token',token , {
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:process.env.NODE_ENV==="production"?
                "none":"strict",
                maxAge:7*24*60*60*1000,
            });

            return res.json({success:true,message:"Welcome user!",userData:{
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified,
            }});

    }catch(err){
        return ({success:false,message:err.message})

    }



};


export const Logout= async(req,res)=>{

    try{

        res.clearCookie('token',{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:process.env.NODE_ENV==='production'?
                'none':'strict',
                maxAge:7*24*60*60*1000,

        })

        return res.json({success:true,message:"Successfully Logged Out!"})

    }catch(err){
        return res.josn({success:false,message:err.message})
    }

}

export const sendVerifyOTP=async(req,res)=>{

    try{
        const{userId}=req.body;

        const user=await userModel.findOne({_id:userId})

        if(user.isAccountVerified){
            return res.json({success:false,messsage:"user already verified"})
        }

        const OTP=String(Math.floor(100000+Math.random()*900000));

        user.verifyOTP=OTP;
        user. verifyOTPExpireAt=Date.now()+24*60*60*1000;

        await user.save();

        const mailOptions={

            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"OTP for Verification",
            text:`Enter the following OTP to Verify:${OTP}`
        }

        await transporter.sendMail(mailOptions);

        res.json({success:true,message:"OTP has been sent"});

    }catch(err){
        res.json({success: false,message:err.message});

    }


};

export const verifyEmail=async(req,res)=>{
    const{userId,OTP}=req.body;

    if(!userId || !OTP){
        res.json({success:false,message:"missing the deatails!"})

    }
    try{
        const user=await userModel.findById(userId);

        if(!user){
            res.json({success:false,message:"user not found"})
        }

        if(user.verifyOTP==='' || user.verifyOTP!==OTP){
            res.json({success:false,message:"Invalid OTP"})
        }

        if(user.verifyOTPExpireAt<Date.now()){
            res.json({success:false,message:"OTP has already expired"})
        }

        user. isAccountVerified=true;

        user.verifyOTP='';
        user.verifyOTPExpireAt=0;

        await user.save();
        return res.json({success:true,message:"Verified successfully!"})



    }catch(err){
        res.json({success:false,message:err.message})

    }

}

export const isAuthenticated=async(req,res,next)=>{

    try{

        return res.json({success:true});

    }catch(err){
        res.json({success:false,message:err.message})
    }

}


//send password reset OTP

export const sendResetOTP=async(req,res)=>{
    const{email}=req.body;

    if(!email){
        res.json({success:false,message:"Email is requires!"})
    }

    try{

        const user=await userModel.findOne({email});

        if(!user){
            res.json({success:false,message:"User not found!"});
}

        const OTP=String(Math.floor(100000+Math.random()*900000));

         user.resetOTP=OTP;
        user.resetOTPExpireAt=Date.now()+15*60*1000;

        await user.save();

        const mailOptions={

            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"OTP for Reset password",
            text:`Enter the following OTP to Reset your password:${OTP}`
        };

        await transporter.sendMail(mailOptions);


        return res.json({success:true,message:"OTP sent to your mail"});




    }catch(err){
        res.json({success:false,message:err.message})
    }

}


export const resetPassword=async(req,res)=>{
    const{email,OTP,newPassword}=req.body;

    if(!email || !OTP || !newPassword){
        res.json({success:false,message:"Missing field"});

    }

    try{

        const user=await userModel.findOne({email});

        if(!user){
            res.json({success:false,message:"User not found!"});

        }

        if(user.resetOTP==='' || user.resetOTP!== OTP){
            return res.json({success:false,message:'Invalid OTP'})
        }

        if(user.resetOTPExpireAt<Date.now()){
            return res.json({success:false,message:"OTP has been expired!"});
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);

        user.password=hashedPassword;

        user.resetOTP='';
        user.resetOTPExpireAt=0;

        user.save();

        return res.json({success:true,message:"Password has been restored successfully!"});

    }catch(err){
        res.json({success:false,message:err.message});
    }


}