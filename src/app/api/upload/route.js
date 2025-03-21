import { NextRequest, NextResponse } from "next/server";
import { uploadPDFToGoogleDrive } from "@/utils/googleDriveService";

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") ;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log file information for debugging
    console.log(
      `Processing file upload: ${file.name}, size: ${file.size} bytes, type: ${file.type}`
    );

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Get additional metadata from form data
      const orderNumber = formData.get("orderNumber") ;
      const customerName = formData.get("customerName") ;
      const documentType = (formData.get("documentType") ) || "order";

      // Upload to Google Drive
      const fileUrl = await uploadPDFToGoogleDrive(
        new Uint8Array(buffer),
        orderNumber,
        customerName,
        documentType
      );

      return NextResponse.json({
        url: fileUrl,
        public_id: `${documentType}-${Date.now()}`,
      });
    } catch (conversionError) {
      console.error("Error converting file for upload:", conversionError);
      return NextResponse.json(
        { error: `File conversion error: ${conversionError.message}` },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Error in upload API route:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Cloudinary" },
      { status: 500 }
    );
  }
}
