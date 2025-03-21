/**
 * Utility for uploading PDF files to Cloudinary
 */

/**
 * Uploads a PDF file to Cloudinary with a unique filename and returns the URL
 * @param pdfBytes - PDF file content as Uint8Array
 * @param orderNumber - Optional order number for filename
 * @param customerName - Optional customer name for filename
 * @param documentType - Type of document (default: 'order')
 * @returns Promise resolving to Cloudinary download URL
 */
export async function uploadPDFToCloudinary(
  pdfBytes,
  orderNumber,
  customerName,
  documentType = "order"
) {
  try {
    // Create a unique filename using customer name, order number or timestamp
    const timestamp = new Date().getTime();
    let filename;

    // Sanitize customer name to handle Arabic characters properly
    const sanitizedName = customerName
      ? customerName.replace(/[^a-zA-Z0-9]/g, "_")
      : "unknown";

    if (customerName && orderNumber) {
      // Use both customer name and order number if available
      filename = `${documentType}-${sanitizedName}-${orderNumber}-${timestamp}.pdf`;
    } else if (orderNumber) {
      // Use order number if available
      filename = `${documentType}-${orderNumber}-${timestamp}.pdf`;
    } else if (customerName) {
      // Use customer name if available
      filename = `${documentType}-${sanitizedName}-${timestamp}.pdf`;
    } else {
      // Fallback to timestamp only
      filename = `${documentType}-${timestamp}.pdf`;
    }

    console.log(`Preparing to upload PDF to Cloudinary: ${filename}`);

    // Convert Uint8Array to base64
    const base64Data = Buffer.from(pdfBytes).toString("base64");

    // Log file size for debugging
    console.log(`PDF size: ${Math.round(base64Data.length / 1024)} KB`);

    // Check if file size exceeds Cloudinary's free tier limit (10MB)
    if (base64Data.length > 10 * 1024 * 1024) {
      console.warn(
        "File size exceeds Cloudinary's free tier limit (10MB). Attempting to compress..."
      );
      // Continue with upload but warn about potential issues
    }

    // Create form data for the API request
    const formData = new FormData();

    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a File object from the Blob
    const file = new File([blob], filename, { type: "application/pdf" });

    // Append the file to the FormData
    formData.append("file", file);

    // Create a clean filename without any extensions
    let cleanFilename;
    if (customerName && orderNumber) {
      // Use the same sanitization method as for the file name
      cleanFilename = `${documentType}-${sanitizedName}-${orderNumber}-${timestamp}`;
    } else if (orderNumber) {
      cleanFilename = `${documentType}-${orderNumber}-${timestamp}`;
    } else if (customerName) {
      // Use the same sanitization method as for the file name
      cleanFilename = `${documentType}-${sanitizedName}-${timestamp}`;
    } else {
      cleanFilename = `${documentType}-${timestamp}`;
    }

    // Add metadata with proper file extension
    formData.append("public_id", cleanFilename);

    // Implement retry logic for network issues
    let retries = 0;
    const maxRetries = 3;
    let lastError = null;

    // Set a longer timeout for larger files
    const timeoutMs = 120000; // 2 minutes

    while (retries < maxRetries) {
      try {
        // Use the Next.js API route to handle the upload
        console.log(
          `Starting upload attempt ${retries + 1} of ${maxRetries}...`
        );

        // Use AbortController for timeout control
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          // Use dynamic origin to ensure correct API endpoint is reached in any environment
          const apiUrl =
            typeof window !== "undefined"
              ? `${window.location.origin}/api/upload`
              : "http://localhost:3000/api/upload"; // Fallback to localhost in server environment
          console.log(`Using API URL: ${apiUrl}`);
          const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
              "Cache-Control": "no-cache",
            },
            credentials: "same-origin",
            signal: controller.signal,
          });

          // Clear the timeout since the request completed
          clearTimeout(timeoutId);

          if (!response.ok) {
            // Try to get more detailed error information from the response
            let errorDetail = "Unknown error";
            try {
              // First try to get the response as text to see what's being returned
              const responseText = await response.text();
              console.log(
                `API response (${response.status}): ${responseText.substring(
                  0,
                  200
                )}...`
              );

              // Try to parse as JSON if possible
              try {
                const errorData = JSON.parse(responseText);
                errorDetail =
                  errorData.error || `Status code: ${response.status}`;
              } catch (jsonError) {
                // If not JSON, use the text with status code
                errorDetail = `Status code: ${
                  response.status
                }, Response: ${responseText.substring(0, 100)}...`;
              }
            } catch (parseError) {
              errorDetail = `Status code: ${response.status}, Parse error: ${parseError.message}`;
            }

            throw new Error(`Upload failed: ${errorDetail}`);
          }

          const data = await response.json();
          console.log(`PDF uploaded successfully, URL: ${data.url}`);
          return data.url;
        } catch (uploadError) {
          // Clear the timeout if it was an abort or other error
          clearTimeout(timeoutId);

          lastError = uploadError;
          retries++;

          // Check if it's an AbortError (timeout)
          if ((uploadError).name === "AbortError") {
            console.warn(
              `Upload attempt ${retries} timed out after ${
                timeoutMs / 1000
              } seconds`
            );
          } else {
            console.warn(`Upload attempt ${retries} failed:`, uploadError);
          }

          if (retries < maxRetries) {
            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, retries) * 1000;
            console.log(`Waiting ${delay / 1000} seconds before retry...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      } catch (error) {
        console.error("Error during upload attempt:", error);
        lastError = error;
        retries++;
      }
    }

    // If all retries failed, throw the last error
    console.error("All upload attempts failed");
    throw lastError;
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    throw error;
  }
}
