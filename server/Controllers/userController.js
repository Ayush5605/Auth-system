import userModel from "../Models/userModels.js";

export const getUserData=async(req,res,next)=>{
    try{

        const {email}=req.body;

        const user=await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User not registered!"});
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }

        })

    }catch(err){
        res.json({success:"true",message:err.message});
    }


    next();
}

