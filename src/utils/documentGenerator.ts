import { createInvoice } from "./createInvoice";
import { createSalesContract } from "./createSalesContract";
import { uploadPDFToGoogleDrive } from "./googleDriveService";

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
  installmentMonths?: number | string;
  downPayment?: number | string;
  invoiceUrl?: string;
  contractUrl?: string;
}

export async function createAndUploadDocuments(
  orderData: OrderData
): Promise<{ invoiceUrl: string; contractUrl: string }> {
  try {
    // إعداد بيانات الدفع
    let downPayment = "0";
    let remainingAmount = orderData.total;
    let paymentSchedule = [];

    // التحقق من معلومات التقسيط
    if (
      orderData.paymentMethod === "tabby" ||
      orderData.paymentMethod === "cash_on_delivery_installment"
    ) {
      if (orderData.installmentMonths && orderData.downPayment) {
        downPayment = orderData.downPayment.toString();
        const downPaymentNum = parseFloat(downPayment);
        const totalNum = parseFloat(orderData.total);
        remainingAmount = (totalNum - downPaymentNum).toString();

        // إنشاء جدول الدفعات
        const months = parseInt(orderData.installmentMonths.toString());
        const monthlyAmount = (parseFloat(remainingAmount) / months).toFixed(2);

        const today = new Date();
        for (let i = 0; i < months; i++) {
          const dueDate = new Date(today);
          dueDate.setMonth(today.getMonth() + i + 1);
          paymentSchedule.push({
            amount: monthlyAmount,
            dueDate: dueDate.toLocaleDateString("ar-SA"),
          });
        }
      }
    } else {
      paymentSchedule = [
        {
          amount: orderData.total,
          dueDate: new Date().toLocaleDateString("ar-SA"),
        },
      ];
    }

    // إعداد بيانات الفاتورة
    const invoiceData = {
      ...orderData,
      customerName: orderData.shippingInfo.fullName,
      customerPhone: orderData.shippingInfo.phone,
      customerAddress: `${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}`,
      cartItems: orderData.cartItems,
      deviceName: orderData.cartItems[0]?.name || "",
      devicePrice: orderData.cartItems[0]?.price || "",
      downPayment,
      remainingAmount,
      paymentSchedule,
    };

    // إنشاء الفاتورة
    const invoicePdfBytes = await createInvoice(invoiceData);

    // إعداد بيانات العقد
    const contractData = {
      customerName: orderData.shippingInfo.fullName,
      customerPhone: orderData.shippingInfo.phone,
      orderNumber: orderData.orderNumber,
      total: orderData.total || "",
      address: orderData.shippingInfo.city
        ? `${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}`
        : orderData.shippingInfo.address || "",
      paymentMethod: orderData.paymentMethod,
      date: new Date().toLocaleDateString("ar-SA"),
    };

    // إنشاء العقد
    const contractPdfBytes = await createSalesContract(contractData);

    // رفع المستندات على جوجل درايف
    const [invoiceUrl, contractUrl] = await Promise.all([
      uploadPDFToGoogleDrive(
        invoicePdfBytes,
        orderData.orderNumber,
        orderData.shippingInfo.fullName,
        "invoice"
      ),
      uploadPDFToGoogleDrive(
        contractPdfBytes,
        orderData.orderNumber,
        orderData.shippingInfo.fullName,
        "contract"
      ),
    ]);

    return { invoiceUrl, contractUrl };
  } catch (error) {
    console.error("Error creating and uploading documents:", error);
    throw error;
  }
}
