import mongoose, { Schema, Types } from "mongoose";

const subscriptionSchema =  new Schema ({
  subscribe: {
    type: Schema.Types.ObjectId, // one who is subscribing
    ref: "User"
  },
  channel:{
    type: Schema.Types.ObjectId, // channel ko subscribe krne wala 
    ref: "User"
  }
},{timestamps: true})



export const subscription = mongoose.model("subscription",subscriptionSchema)