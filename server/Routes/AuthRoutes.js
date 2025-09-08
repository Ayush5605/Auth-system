import express from "express";
import { isAuthenticated, login, Logout, register, resetPassword, sendResetOTP, sendVerifyOTP, verifyEmail } from "../Controllers/authController.js";
import userAuth from "../Middlewares/userAuth.js";


const authRouter=express.Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",Logout);
authRouter.post("/send-verify-otp",userAuth,sendVerifyOTP);
authRouter.post("/verify-account",userAuth,verifyEmail);
authRouter.post("/is-auth",userAuth,isAuthenticated);
authRouter.post("/send-reset-otp",sendResetOTP);
authRouter.post("/reset-password",resetPassword);




export default authRouter;