/**
 * Local file storage utility to simulate Cloudinary uploads
 * This implementation uses the local file storage mechanism
 */
import { uploadFile } from "./fileStorage";

/**
 * Simulates uploading a PDF file to Cloudinary and returns a mock URL
 * @param pdfBytes The PDF file as a Uint8Array
 * @param orderNumber Order number to use in the filename
 * @param customerName Customer name to use in the filename
 * @param documentType Type of document (invoice or contract)
 * @returns Promise that resolves to a mock download URL
 */
export async function uploadPDFToCloudinary(
  pdfBytes: Uint8Array,
  orderNumber: string,
  customerName: string,
  documentType: "invoice" | "contract"
): Promise<string> {
  try {
    // Sanitize customer name for use in filename
    const sanitizedName = customerName.replace(/[^a-zA-Z0-9]/g, "_");

    // Create a path for the PDF file
    const path = `orders/${documentType}_${orderNumber}_${sanitizedName}`;

    // Use the generic upload function from fileStorage
    return await uploadFile(pdfBytes, path);
  } catch (error) {
    console.error(`Error uploading ${documentType} to storage:`, error);
    throw error;
  }
}
