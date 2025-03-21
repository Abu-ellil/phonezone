import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Define the InvoiceData interface
interface InvoiceData {
  orderNumber: string;
  shippingInfo: {
    fullName: string;
    phone: string;
    address?: string;
    city?: string;
    email?: string;
  };
  cartItems?: {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image_url?: string;
  }[];
  subtotal?: number;
  shippingCost?: number;
  total?: string;
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  deviceName?: string;
  devicePrice?: string;
  downPayment?: string;
  remainingAmount?: string;
  paymentSchedule?: Array<{
    amount: string;
    dueDate: string;
  }>;
}

// Function to generate the invoice as a PDF
export async function createInvoice(
  invoiceData: InvoiceData
): Promise<Uint8Array> {
  // 1️⃣ Generate the HTML content for the invoice
  const invoiceHtml = generateInvoiceHtml(invoiceData);

  // 2️⃣ Convert the HTML content into a PDF
  const pdfBuffer = await convertHtmlToPdf(invoiceHtml);

  return pdfBuffer;
}

// Function to dynamically generate the HTML for the invoice
function generateInvoiceHtml(data: InvoiceData): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>فاتورة طلب</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

    :root {
      --primary-color: #0066cc;
      --secondary-color: #4a4a4a;
      --border-color: #e0e0e0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Cairo', Arial, sans-serif;
      direction: rtl;
      text-align: right;
      width: 210mm;
      min-height: 297mm;
      margin: auto;
      padding: 10mm;
      background-color: white;
      color: var(--secondary-color);
      line-height: 1.4;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      max-width: 100px;
      margin-bottom: 10px;
    }

    h1 {
      color: var(--primary-color);
      font-size: 20px;
      margin-bottom: 10px;
    }

    h2 {
      color: var(--primary-color);
      font-size: 16px;
      margin: 15px 0 10px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 5px;
    }

    .info-section {
      margin: 15px 0;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .info-section p {
      margin: 5px 0;
      font-size: 12px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      table-layout: fixed;
      font-size: 11px;
    }

    th {
      background-color: var(--primary-color);
      color: white;
      font-size: 12px;
      padding: 8px;
      font-weight: 600;
    }

    td {
      font-size: 11px;
      padding: 6px;
      border-bottom: 1px solid var(--border-color);
      word-wrap: break-word;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .summary {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .total {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-color);
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid var(--border-color);
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid var(--border-color);
      text-align: center;
      font-size: 10px;
      color: #666;
    }

    @media print {
      body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 0;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://res.cloudinary.com/masoft/image/upload/v1742515082/hlz3hflj6fogegitohg3.png" alt="فون زون" class="logo" onerror="this.src='/logo.png'">
    <h1>فاتورة طلب</h1>
  </div>

  <div class="info-section">
    <h2>معلومات العميل</h2>
    <p>اسم العميل: ${data.customerName}</p>
    <p>رقم الجوال: ${data.customerPhone}</p>
    <p>العنوان: ${data.customerAddress}</p>
  </div>

  <h2>تفاصيل الفاتورة</h2>
  <table>
    <tr>
      <th>#</th>
      <th>اسم الجوال</th>
      <th>السعر</th>
      <th>الكمية</th>
      <th>الإجمالي</th>
    </tr>
    <tr>
      <td>1</td>
      <td>${data.deviceName}</td>
      <td>${data.devicePrice} ريال</td>
      <td>1</td>
      <td>${data.devicePrice} ريال</td>
    </tr>
  </table>

  <div class="summary">
    <h2>ملخص الطلب</h2>
    <p>الإجمالي: ${data.total} ريال</p>
    <p>الدفعة المقدمة: ${data.downPayment} ريال</p>
    <p class="total">المتبقي: ${data.remainingAmount} ريال</p>
  </div>

  <h2>جدول الدفعات</h2>
  <table>
    <tr>
      <th>#</th>
      <th>الدفعة</th>
      <th>تاريخ الاستحقاق</th>
    </tr>
    ${data.paymentSchedule
      ?.map(
        (payment, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${payment.amount} ريال</td>
      <td>${payment.dueDate}</td>
    </tr>
    `
      )
      .join("")}
  </table>

  <div class="footer">
    <p>فون زون - جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
    <p>للتواصل: +966 54 767 5648</p>
  </div>
</body>
</html>
  `;
}

// Function to convert HTML to PDF
async function convertHtmlToPdf(html: string): Promise<Uint8Array> {
  // Create an iframe to isolate the HTML rendering
  const iframe = document.createElement("iframe");
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) throw new Error("Failed to create document");

  doc.open();
  doc.write(html);
  doc.close();

  try {
    // Wait for fonts to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Capture the rendered HTML as a canvas image with improved quality
    const canvas = await html2canvas(doc.body, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      foreignObjectRendering: true,
    });

    // Create a new PDF document in A4 size with better quality settings
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add the image to the PDF with proper scaling
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
    const pdfBuffer = new Uint8Array(pdf.output("arraybuffer"));

    // Clean up the iframe
    document.body.removeChild(iframe);

    return pdfBuffer;
  } catch (error) {
    console.error("PDF conversion error:", error);
    document.body.removeChild(iframe);
    throw new Error("Failed to generate PDF");
  }
}

// Helper function to map payment method codes to human-readable names
function getPaymentMethodName(method: string): string {
  switch (method) {
    case "credit_card":
      return "بطاقة ائتمان";
    case "debit_card":
      return "بطاقة خصم";
    case "tabby":
      return "تقسيط (تابي)";
    case "cash_on_delivery":
      return "الدفع عند الاستلام";
    default:
      return method;
  }
}
