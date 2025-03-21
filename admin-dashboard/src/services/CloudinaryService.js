// CloudinaryService.js
import cloudinary from "../cloudinaryConfig";
import { UploadApi } from "@cloudinary/url-builder/action";

/**
 * Service for handling image uploads to Cloudinary
 */
export const uploadImageToCloudinary = async (imageFile) => {
  try {
    return await cloudinary.upload(imageFile, {
      upload_preset: "noon_store",
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary using its public ID
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    return await cloudinary.delete(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

/**
 * Helper function to convert File object to base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
