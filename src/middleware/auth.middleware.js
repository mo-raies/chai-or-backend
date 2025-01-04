import { ApiError } from "../utils/ApiError.js"
import {asyncHandalar} from "../utils/asyncHandaler.js"

import jwt  from "jsonwebtoken"
import { User} from "../models/user.models.js"


export const verifyJWT = asyncHandalar (async(req, _, next) => {
  try {
    const token =  req.cookies?.accessToken || req.header 
     ("Authorization")?.replace("Bearer ","")
  
     if (!token) {
      throw new ApiError (401 , "unauthorized request")
     }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id).select
    ("-password -refreshToken")
  
    if (!user) {
      // NEXT_VIDEO: discuse about frontend 
      throw new ApiError(401, "invalid Access token")
    }
  
    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid Access token")
  }

})

