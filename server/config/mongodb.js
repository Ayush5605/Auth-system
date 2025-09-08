import mongoose from "mongoose";



const mongoDB=async()=>{

    

    try{
   
    
    await mongoose.connect(`${process.env.MONGODB_URL}/AUTH_PROJECT`);
    console.log("database connected");
    } catch(err){
    console.log(err);
}
}


export default mongoDB;