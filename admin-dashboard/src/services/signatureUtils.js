// signatureUtils.js

/**
 * Generate a signature for Cloudinary upload using Web Crypto API
 * @param {number} timestamp - Current timestamp in seconds
 * @param {string} apiSecret - Cloudinary API secret
 * @returns {Promise<string>} - Generated signature in hexadecimal format
 * @throws {Error} If input parameters are invalid or crypto operations fail
 */
export const generateSignature = async (timestamp, apiSecret) => {
  // Validate input parameters
  if (!timestamp || typeof timestamp !== "number") {
    throw new Error("Timestamp must be a valid number");
  }
  if (!apiSecret || typeof apiSecret !== "string") {
    throw new Error("API Secret must be a valid string");
  }

  try {
    // Create the string to be hashed
    const str = `timestamp=${timestamp}${apiSecret}`;

    // Convert string to Uint8Array for crypto operations
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    // Generate SHA-256 hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert buffer to hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  } catch (error) {
    throw new Error(`Failed to generate signature: ${error.message}`);
  }
};
