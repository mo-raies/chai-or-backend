import mongoose, {Schema, Types} from "mongoose";

const tweetSchema = new Schema(
  {
    owner: {
      types: Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      types: String,
      required: true
    }
  },{timestamps: true})

export const Tweet = mongoose.model("Tweet",tweetSchema)

