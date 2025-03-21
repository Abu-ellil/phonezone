import { createInvoice } from "./createInvoice";
import { createSalesContract } from "./createSalesContract";
import { uploadPDFToCloudinary } from "./cloudinaryUploader";

interface OrderData {
  orderNumber: string;
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    email: string;
    neighborhood?: string;
    street?: string;
    houseDescription?: string;
    postalCode?: string;
    whatsapp?: string;
  };
  cartItems: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: string;
  paymentMethod: string;
  invoiceUrl?: string;
  contractUrl?: string;
}

export async function createAndUploadOrderDocuments(
  orderData: OrderData
): Promise<{ invoiceUrl: string; contractUrl: string }> {
  try {
    // Create invoice
    const invoicePdfBytes = await createInvoice(orderData);

    // Create sales contract
    const contractData = {
      customerName: orderData.shippingInfo.fullName,
      customerPhone: orderData.shippingInfo.phone,
      orderNumber: orderData.orderNumber,
      total: orderData.total || "",
      
      paymentMethod: orderData.paymentMethod,
      date: new Date().toLocaleDateString("ar-SA"),
    };

    const contractPdfBytes = await createSalesContract(contractData);

    // Log document sizes for debugging
    console.log(
      `Invoice PDF size: ${Math.round(invoicePdfBytes.length / 1024)} KB`
    );
    console.log(
      `Contract PDF size: ${Math.round(contractPdfBytes.length / 1024)} KB`
    );

    // Check if either PDF exceeds Cloudinary's free tier limit (10MB)
    const maxSizeKB = 10 * 1024; // 10MB in KB
    if (
      invoicePdfBytes.length > maxSizeKB * 1024 ||
      contractPdfBytes.length > maxSizeKB * 1024
    ) {
      console.warn(
        "One or both PDFs exceed Cloudinary's free tier size limit. Upload may fail."
      );
    }

    // Upload files in parallel with error handling for each
    let invoiceUrl = "";
    let contractUrl = "";

    try {
      // Try to upload both documents, but continue even if one fails
      const results = await Promise.allSettled([
        uploadPDFToCloudinary(
          invoicePdfBytes,
          orderData.orderNumber,
          orderData.shippingInfo.fullName,
          "invoice"
        ),
        uploadPDFToCloudinary(
          contractPdfBytes,
          orderData.orderNumber,
          orderData.shippingInfo.fullName,
          "contract"
        ),
      ]);

      // Process results
      if (results[0].status === "fulfilled") {
        invoiceUrl = results[0].value;
      } else {
        console.error("Invoice upload failed:", results[0].reason);
      }

      if (results[1].status === "fulfilled") {
        contractUrl = results[1].value;
      } else {
        console.error("Contract upload failed:", results[1].reason);
      }
    } catch (uploadError) {
      console.error("Error during document uploads:", uploadError);
    }

    // Continue with order processing even if document uploads failed
    return {
      invoiceUrl: invoiceUrl || "upload_failed",
      contractUrl: contractUrl || "upload_failed",
    };
  } catch (error) {
    console.error("Error creating and uploading order documents:", error);
    throw error;
  }
}
