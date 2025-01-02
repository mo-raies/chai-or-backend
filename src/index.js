// Import environment variables and required modules
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config({ path: "./.env" });

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT || 8000}`);
    });

    // Handle server-level errors
    app.on("error", (err) => {
      console.error("ERROR: ", err);
    });
  })
  .catch((err) => {
    console.error("MONGODB connection failed !! ", err.message);
    process.exit(1); // Exit the process with a failure code
  });










// import express from "express";

// const app = express()

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME} `)
//   } catch (error) {
//     console.log("ERROR:", error);
//     app.on( "error", (error) => {
//     console.log("error:", error);
//     throw err
//     } )

// app.listen (process.env.PORT ,() => {
//   console.log(`App is listing on port ${process.env.PORT}`);
  

// })

//     throw err

//   }
// })() 