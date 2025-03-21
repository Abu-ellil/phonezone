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
    <img src="/logo.png" alt="فون زون للاتصالات" class="logo">
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
    <p class="amount">${data.total} ريال فقط</p>
    <p>و ذلك قيمة عن ما تبقى من جهاز / ${deviceDetails}</p>
    <p>قيمة الدفعة الشهرية : ${monthlyPayment} ريال فقط لمدة ${numberOfMonths} أشهر اعتباراً من تاريخ ${
    data.startDate || formattedStartDate
  } و حتى ${data.endDate || formattedEndDate}</p>
  </div>

  <div class="contract-section">
    <p>نهاية المبلغ المذكور أعلاه و التي يسداد الأقساط في موعدها بدون تأخر إلى قسط عن موضعه المصدر فإنني ملتزم التزاماً تاماً
    بتسديد المبلغ المتبقي كاملاً دفعة واحدة</p>
    <p>كما أنني أقر على نفسي أنه لا يوجد التزامات مالية ولا كفالات غرامية و قد أدنت و الله غير الشافعين</p>
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
