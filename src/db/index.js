import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectdDB =  (async () => {
  try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   console.log(
    `MongoDB connected! DB host: ${connectionInstance.connection.host}, DB name: ${connectionInstance.connection.name}`
  );

   
   
   
  } catch (error) {
    console.log("mongoDB connected faild:", error);
    process.exit(1)
    
  }
})
export default connectdDB