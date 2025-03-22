// signatureUtils.js
import crypto from "crypto";

/**
 * Generate a signature for Cloudinary upload
 * @param {number} timestamp - Current timestamp
 * @param {string} apiSecret - Cloudinary API secret
 * @returns {string} - Generated signature
 */
export const generateSignature = (timestamp, apiSecret) => {
  const str = `timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash("sha256").update(str).digest("hex");
};
