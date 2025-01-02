import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use fs.promises for asynchronous file handling

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload files to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    
    if (!localFilePath) {
      throw new Error("File path is required for upload");
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detect file type
    });

    console.log("File uploaded to Cloudinary:", response.url);
  //  fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);

    // Remove the temporary file if upload fails
    try {
      await fs.unlink(localFilePath);
      console.log("Temporary file deleted:", localFilePath);
    } catch (unlinkError) {
      console.error("Error deleting temporary file:", unlinkError.message);
    }

    // Optionally rethrow the error to handle it in the calling function
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export { uploadOnCloudinary };
