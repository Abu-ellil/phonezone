import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Uploads a PDF file to Firebase Storage with a unique filename
 * @param pdfBytes The PDF file as a Uint8Array
 * @param orderNumber Optional order number to use in the filename
 * @returns Promise that resolves to the download URL of the uploaded file
 */
export async function uploadPDFToFirebase(
  pdfBytes: Uint8Array,
  orderNumber?: string
): Promise<string> {
  try {
    // Create a unique filename using order number or timestamp
    const timestamp = new Date().getTime();
    const filename = orderNumber
      ? `orders/order-${orderNumber}-${timestamp}.pdf`
      : `orders/order-${timestamp}.pdf`;

    console.log(`Uploading PDF to Firebase: ${filename}`);
    const storageRef = ref(storage, filename);

    // Set custom metadata to help with CORS
    const metadata = {
      contentType: "application/pdf",
      customMetadata: {
        orderNumber: orderNumber || "unknown",
      },
    };

    // Implement retry logic for CORS issues
    let retries = 0;
    const maxRetries = 3;
    let lastError = null;

    while (retries < maxRetries) {
      try {
        await uploadBytes(storageRef, pdfBytes, metadata);
        console.log("PDF uploaded successfully, getting download URL...");
        const downloadURL = await getDownloadURL(storageRef);
        console.log(`Download URL obtained: ${downloadURL}`);
        return downloadURL;
      } catch (uploadError) {
        lastError = uploadError;
        retries++;
        console.warn(`Upload attempt ${retries} failed:`, uploadError);

        if (retries < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, retries) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // If we get here, all retries failed
    console.error("All upload attempts failed", lastError);
    throw lastError;
  } catch (error) {
    console.error("Error uploading PDF to Firebase:", error);
    if (error instanceof Error && error.message.includes("CORS")) {
      console.error(
        "CORS error detected. Make sure Firebase Storage CORS configuration is updated."
      );
      // Return a fallback URL or handle the error gracefully
      return "";
    }
    throw error;
  }
}
