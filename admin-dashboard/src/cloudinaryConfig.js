// Cloudinary configuration
import { Cloudinary } from "@cloudinary/url-gen";

// Get configuration from environment variables
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;

if (!cloudName || !uploadPreset || !apiKey || !apiSecret) {
  console.error(
    "Cloudinary configuration is missing. Please check your environment variables."
  );
  throw new Error("Missing required Cloudinary configuration");
}

// Create a Cloudinary instance
const cloudinary = new Cloudinary({
  cloud: {
    cloudName,
  },
});

export const UPLOAD_PRESET = uploadPreset;

export default cloudinary;
