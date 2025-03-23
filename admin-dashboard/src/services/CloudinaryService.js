// CloudinaryService.js
import { generateSignature } from "./signatureUtils";

/**
 * Service for handling image uploads to Cloudinary
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<{url: string, publicId: string}>} The upload result
 * @throws {Error} If the upload fails or configuration is missing
 */
export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
    const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;

    if (!cloudName || !uploadPreset || !apiKey || !apiSecret) {
      console.error("Missing Cloudinary configuration", {
        cloudName: !!cloudName,
        uploadPreset: !!uploadPreset,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      });
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    // Validate file
    if (!imageFile || !(imageFile instanceof File)) {
      console.error("Invalid file provided", {
        fileType: imageFile ? typeof imageFile : "null",
      });
      throw new Error(
        "Invalid file provided. Please provide a valid image file."
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      console.error("Invalid file type", { type: imageFile.type });
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (imageFile.size > maxSize) {
      console.error("File too large", { size: imageFile.size, maxSize });
      throw new Error(
        `File size exceeds limit. Maximum size allowed: ${
          maxSize / (1024 * 1024)
        }MB`
      );
    }

    // Generate timestamp and signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(timestamp, apiSecret);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    // Set timeout for upload request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
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
      if (!data.secure_url || !data.public_id) {
        throw new Error("Invalid response from Cloudinary");
      }

      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary using its public ID
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} The deletion result
 * @throws {Error} If the deletion fails or configuration is missing
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId || typeof publicId !== "string" || !publicId.trim()) {
    console.error("Invalid public ID provided", { publicId });
    throw new Error("Valid public ID is required for image deletion");
  }

  try {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
    const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    // Generate timestamp and signature for secure deletion
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(timestamp, apiSecret);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: apiKey,
          timestamp: timestamp.toString(),
          signature: signature,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.error?.message || `Delete failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    if (!data.result || data.result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }

    return data;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
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
