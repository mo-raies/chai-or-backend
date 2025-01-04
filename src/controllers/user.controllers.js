import { asyncHandalar } from "../utils/asyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const genrateAccesAndRefereshTokens = async (userId)=> {
  try {
   const user = await User.findById(userId)
   const accessToken =  user.genrateAccesToken()
   const refreshToken =  user.genrateRefreshToken()


   console.log("token",accessToken,refreshToken)
   user.refreshToken = refreshToken
   await user.save({validateBeforeSave : false})

    return {accessToken, refreshToken} 

   
  } catch (error) {
    throw new ApiError (500, "something went wrong while genrating refresh and access token  ")
  }
}


const registerUser = asyncHandalar(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("username:", req.body);
  console.log("df:", req.files);

  // Validate required fields
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
 console.log(req.files);
 
  
  // Handle file uploads
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

 let coverImageLocalPath;
 if (req.files && Array.isArray(req.files.coverImage) 
     && req.files.coverImage.length > 0) {
  coverImageLocalPath = req.files.coverImage[0].path
 }


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : { url: "" };

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  // Create user in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Fetch the created user without sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Send success response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});


const loginUser = asyncHandalar (async (req ,res ) => {
  // request body -> data 
  // username or email 
  // find the user 
  // password check 
  // access and refresh token 
  // send cookie

  const {email , username , password} = req.body
  console.log("email", email);
  console.log("password", password);

  if (!email) {
    throw new ApiError (400, "username or email is required")
  }
  
  const user = await User.findOne( {email:email})
  
  if (!user) {
    throw new ApiError (404, "user does not exist")
  }
  
  const isPasswordValid = await user.isPasswordCorrect(password)
  
  if (!isPasswordValid ) {
    throw new ApiError (404, "Invalid user credentials")
  }
  
  const { accessToken, refreshToken} = await genrateAccesAndRefereshTokens
  (user._id)
  
  const loggedInUser =  await User.findById(user._id).select("-password -refreshToken")
  
  const options =  {
    httpOnly: true,
    secure: true
  }
  return res.
     status(200)
    .cookie("accessToken",accessToken,options )
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse (
        200, 
        {
         user: loggedInUser , accessToken ,
         refreshToken
        },
        "user logged in successfuly"
      )
    )
})

const logoutUser = asyncHandalar ( async (req ,res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },{
      new: true
    }
  )
  const options =  {
    httpOnly: true,
    secure: true
  }
  return res 
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json (new ApiResponse (200, {}, "user logged out"))
})

const refreshAccessToken = (async (req , res) => {
const inComingRefreshToken =   req.cookie.refreshToken || req.body.refreshToken

if (!inComingRefreshToken) {
  throw new ApiError (401 , "unauthorized request")
}

try {
  const decodedToken =  jwt.verify(
    inComingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )
  
  const user =  await User.findById(decodedToken?._id)
  if (!user) {
    throw new ApiError(401 , "invalid refresh token")
  }
  if (inComingRefreshToken !== user?.refreshToken ) {
    throw new ApiError(401 , "Refresh token is expired or used ")
  }
  const options = {
  httpOnly: true,
  secure: true
  }
  
  const {accessToken ,newRefreshToken} = await genrateAccesAndRefereshTokens(user._id)
  
  return res 
  .status(200)
  .cookie("accessToken", accessToken , options)
  .cookie("refreshToken", newRefreshToken , options)
  .json (
    new ApiResponse(
      200,
      {accessToken , refreshToken: newRefreshToken},
      "Access Token refreshed"
    )
  )
  
} catch (error) {
  throw new ApiError (401, error?.message || "Invalid refresh Token")
}

})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
 };
