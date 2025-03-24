import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ContractData {
  customerName: string;
  customerPhone: string;
  customerMobile?: string;
  orderNumber: string;
  total: string;
  monthlyPayment?: string;
  numberOfMonths?: number;
  deviceDetails?: string;
  paymentMethod?: string;
  date?: string;
  day?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
}

export async function createSalesContract(
  contractData: ContractData
): Promise<Uint8Array> {
  const contractHtml = generateContractHtml(contractData);

  const pdfBuffer = await convertHtmlToPdf(contractHtml);

  return pdfBuffer;
}

function generateContractHtml(data: ContractData): string {
  const currentDate = data.date || new Date().toLocaleDateString("ar-SA");
  const monthlyPayment = data.monthlyPayment || "248";
  const numberOfMonths = data.numberOfMonths || 1;
  const deviceDetails = data.deviceDetails || "آيفون 16 256";

  // Calculate payment schedule
  const paymentSchedule = [];
  const totalAmount = parseFloat(data.total.replace(/,/g, ""));
  const monthlyAmount = parseFloat(monthlyPayment);
  let remainingBalance = totalAmount;

  const startDate = new Date();
  if (data.date) {
    try {
      // Try to parse the provided date
      const dateParts = data.date.split("/");
      if (dateParts.length === 3) {
        // Assuming date format is DD/MM/YYYY
        startDate.setFullYear(
          parseInt(dateParts[2]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[0])
        );
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
  }

  for (let i = 0; i < numberOfMonths; i++) {
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    // Format date in Arabic
    const formattedDate = paymentDate.toLocaleDateString("ar-SA");

    // For the last payment, adjust to cover any remaining amount
    const payment = i === numberOfMonths - 1 ? remainingBalance : monthlyAmount;
    remainingBalance -= payment;

    paymentSchedule.push({
      installmentNumber: i + 1,
      date: formattedDate,
      amount: payment.toFixed(2),
      remainingBalance: Math.max(0, remainingBalance).toFixed(2),
    });
  }

  // Calculate end date for contract
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + numberOfMonths);
  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format dates for contract display
  const formattedStartDate = startDate.toLocaleDateString("ar-SA");

  // Get day of week in Arabic
  const weekdays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const dayOfWeek = weekdays[startDate.getDay()];

  // Set default values for missing fields
  const address = data.address || "";
  const day = data.day || dayOfWeek;

  return `
   <!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>عقد بيع تقسيط</title>
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
      margin-bottom: 30px;
    }

    .logo {
      max-width: 100px;
      margin-bottom: 10px;
    }

    h1 {
      color: var(--primary-color);
      font-size: 24px;
      margin-bottom: 10px;
    }

    h2 {
      color: var(--primary-color);
      font-size: 18px;
      margin: 15px 0 10px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 5px;
    }

    .contract-section {
      margin: 15px 0;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .contract-section p {
      margin: 10px 0;
      font-size: 14px;
    }

    .amount {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 15px 0;
    }

    .signature-section {
      margin-top: 40px;
    }

    .signature-line {
      margin: 10px 0;
      border-top: 1px solid var(--border-color);
      width: 200px;
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
    }
  </style>
</head>
<body>
  <div class="header">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="453" height="138" viewBox="0 0 453 138">
                    <image xlink:href="data:image/png;base64,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" x="0" y="0" width="453" height="138"/>
                  </svg>
    <h1>عقد بيع تقسيط</h1>
  </div>

  <div class="contract-section">
    <p><strong>اليوم:</strong> ${day}</p>
    <p><strong>التاريخ:</strong> ${currentDate}</p>
    <p><strong>نعم انا السيد/ة:</strong> ${
      data.customerName
    } / <strong>رقم الجوال:</strong> ${
    data.customerPhone
  } وعنوانه/ ${address}</p>
  </div>

  <div class="contract-section">
    <p>أقر و أعترف و أنا في حالتى الشرعية بأنني في ذمتي للمؤسسة المدعوة / فون زون مبلغ و قدره</p>
    <p class="amount">${data.total} د.إ فقط</p>
    <p>و ذلك قيمة عن ما تبقى من جهاز / ${deviceDetails}</p>
    <p>قيمة الدفعة الشهرية : ${monthlyPayment} د.إ فقط لمدة ${numberOfMonths} أشهر اعتباراً من تاريخ ${
    data.startDate || formattedStartDate
  } و حتى ${data.endDate || formattedEndDate}</p>
  </div>

  <div class="contract-section">
    <p>نهاية المبلغ المذكور أعلاه وانني بسداد الأقساط في موعدها بدون تأخر اي قسط عن موعده المحدد فإنني ملتزم التزاماً تاماً
    بتسديد المبلغ المتبقي كاملاً دفعة واحدة</p>
    <p>كما أنني أقر على نفسي أنه لا يوجد التزامات مالية ولا كفالات غرامية و قد أذنت و الله غير الشاهدين</p>
  </div>

  <div class="signature-section">
    <h2>التوقيعات</h2>
    <p>الاسم / : التوقيع</p>
    <div class="signature-line"></div>
  </div>

  <div class="footer">
    <p>فون زون - جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
    <p>للتواصل: +971547675648 </p>
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
