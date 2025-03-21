import { PdfPrinter } from "pdfmake";
import arabicFonts from "../../../utils/arabicFonts";

export default async function handler(req, res) {
  try {
    const printer = new PdfPrinter(arabicFonts);
    const docDefinition = {
      content: [
        { text: "فاتورة جديدة", style: "header", alignment: "right" },
        { text: "هذه فاتورة تجريبية", style: "body", alignment: "right" },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        body: { fontSize: 12, lineHeight: 1.5 },
      },
      defaultStyle: {
        font: "Cairo",
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=fatura.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      error: "خطأ في توليد PDF",
      details: error.message,
      solution: "يرجى التحقق من إعدادات الخطوط وخدمة التوليد",
    });
  }
}
