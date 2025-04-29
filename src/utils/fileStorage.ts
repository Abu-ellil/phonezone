/**
 * Local file storage utility to replace Firebase storage functionality
 * This implementation simulates file storage by using localStorage
 */

/**
 * Simulates uploading a file and returns a mock URL
 * In a real application, you would implement a proper file upload service
 * @param fileBytes The file as a Uint8Array
 * @param path The path where the file should be stored
 * @returns Promise that resolves to a mock download URL
 */
export async function uploadFile(
  fileBytes: Uint8Array,
  path: string
): Promise<string> {
  try {
    // Create a unique identifier for the file
    const timestamp = new Date().getTime();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const filename = `${path}-${timestamp}-${uniqueId}`;

    // In a real application, you would upload the file to a server
    // For now, we'll just simulate it by storing a reference in localStorage

    // Convert the first few bytes to a string for demonstration purposes
    // (don't store the entire file in localStorage as it could be too large)
    const fileSizeKB = Math.round(fileBytes.length / 1024);
    const fileInfo = {
      filename,
      timestamp,
      sizeKB: fileSizeKB,
      type: path.includes(".pdf")
        ? "application/pdf"
        : "application/octet-stream",
    };

    // Store file info in localStorage (just for demonstration)
    const storedFiles = JSON.parse(localStorage.getItem("storedFiles") || "[]");
    storedFiles.push(fileInfo);
    localStorage.setItem("storedFiles", JSON.stringify(storedFiles));

    console.log(
      `File "${filename}" (${fileSizeKB} KB) stored locally (simulated)`
    );

    // Return a mock URL that includes the filename
    return `http://localhost:3000/files/${filename}`;
  } catch (error) {
    console.error("Error storing file locally:", error);
    throw error;
  }
}

/**
 * Simulates uploading a PDF file and returns a mock URL
 * @param pdfBytes The PDF file as a Uint8Array
 * @param orderNumber Optional order number to use in the filename
 * @returns Promise that resolves to a mock download URL
 */
export async function uploadPDFToStorage(
  pdfBytes: Uint8Array,
  orderNumber?: string
): Promise<string> {
  try {
    // Create a path for the PDF file
    const path = orderNumber ? `orders/order-${orderNumber}` : "orders/order";

    // Use the generic upload function
    return await uploadFile(pdfBytes, path);
  } catch (error) {
    console.error("Error uploading PDF to storage:", error);
    throw error;
  }
}
