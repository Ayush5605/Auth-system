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

<<<<<<< HEAD
const allowedOrigins=['http://localhost:5173','http://localhost:5174'];
=======
const allowedOrigins=['http://localhost:5174'];
>>>>>>> 406166e3f2b5089f57201aedbc715e7373c057ee

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

app.listen(port,()=>{
    console.log(`Listening on port ${port}`

    )
});

app.use('/api/auth',authRouter);

app.use("/api/user",userRouter,getUserData);

app.get("/",(req,res)=>{
    res.send("Hello");
})

