import express from "express";
import { login, Logout, register, sendVerifyOTP, verifyEmail } from "../Controllers/authController.js";
import userAuth from "../Middlewares/userAuth.js";


const authRouter=express.Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",Logout);
authRouter.post("/send-verify-otp",userAuth,sendVerifyOTP);
authRouter.post("/verify-account",userAuth,verifyEmail);



export default authRouter;