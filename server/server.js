import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import mongoDB from "./config/mongodb.js";
import userModel from "./Models/userModels.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";
import { getUserData } from "./Controllers/userController.js";




const app=express();
const port=process.env.port || 4000;
mongoDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.listen(port,()=>{
    console.log(`Listening on port ${port}`

    )
});

app.use('/api/auth',authRouter);

app.use("/api/user",userRouter,getUserData);

app.get("/",(req,res)=>{
    res.send("Hello");
})

