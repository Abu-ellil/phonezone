// CloudinaryService.js
import cloudinary from "../cloudinaryConfig";

/**
 * Service for handling image uploads to Cloudinary
 */
export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;

    if (!cloudName || !uploadPreset || !apiKey) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    // Log the request details for debugging
    console.log("Cloudinary upload configuration:", {
      cloudName,
      uploadPreset,
    });

    // Log the request details for debugging
    console.log("Uploading to Cloudinary with preset:", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error?.message ||
        `Upload failed with status: ${response.status}`;
      console.error("Cloudinary upload error:", errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary using its public ID
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: uploadPreset,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Delete failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Remove the unused function
// const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };
