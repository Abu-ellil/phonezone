"use client";
import { createAndUploadOrderDocuments } from "@/utils/pdfGenerator";
import { getAppSettings } from "@/firebase/settingsService";
import { ToastContainer, toast } from "react-toastify";
import { sendOrderToTelegram } from "@/utils/telegram";
import CheckoutSteps from "./components/CheckoutSteps";
import { useState, useEffect, Suspense } from "react";
import ShippingForm from "./components/ShippingForm";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Loading } from "@/components/Loading";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

// Component to handle search params
function CheckoutContent() {
  const { cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");

  // State for installment information
  const [installmentInfo, setInstallmentInfo] = useState({
    months: 3, // Default values that will be overridden by Firebase settings
    downPayment: 420, // Default values that will be overridden by Firebase settings
    monthlyInstallment: "0.00",
  });

  useEffect(() => {
    const method = searchParams?.get("paymentMethod");
    if (method) {
      setPaymentMethod(method);
    }

    // Get installment information from URL if payment method is tabby
    if (method === "tabby") {
      const months = searchParams?.get("installmentMonths");
      const downPayment = searchParams?.get("downPayment");
      const monthlyInstallment = searchParams?.get("monthlyInstallment");

      if (months && downPayment && monthlyInstallment) {
        setInstallmentInfo({
          months: parseInt(months),
          downPayment: parseFloat(downPayment),
          monthlyInstallment: monthlyInstallment,
        });
      } else {
        // Use hardcoded default values
        const totalValue = parseFloat(searchParams?.get("total") || "0");
        const defaultDownPayment = Math.min(420, totalValue * 0.2);
        const remainingAmount = totalValue - defaultDownPayment;
        const defaultMonthlyInstallment =
          remainingAmount > 0 ? (remainingAmount / 3).toFixed(2) : "0.00";

        setInstallmentInfo({
          months: 3,
          downPayment: defaultDownPayment,
          monthlyInstallment: defaultMonthlyInstallment,
        });
      }
    }
  }, [searchParams]);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    houseDescription: "",
    postalCode: "",
    countryCode: "",
    phone: "",
    whatsapp: "",
    email: "",
  });
  const [shippingErrors, setShippingErrors] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setShippingErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace(" د.إ", "").replace(",", ""))
            : parseFloat(item.price);
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // Get shipping method from URL parameters or default to aramex
  const [shippingMethod, setShippingMethod] = useState("aramex");

  useEffect(() => {
    const method = searchParams?.get("shippingMethod");
    if (method) {
      setShippingMethod(method);
    }
  }, [searchParams]);

  const getShippingCost = () => {
    return shippingMethod === "aramex" ? 45 : 24;
  };

  const shippingCost = getShippingCost();
  const subtotal = parseFloat(calculateSubtotal());
  const total = (subtotal + shippingCost).toFixed(2);

  const handleShippingSubmit = () => {
    let hasErrors = false;
    const newErrors = { ...shippingErrors };

    if (!shippingInfo.fullName) {
      newErrors.fullName = "الرجاء إدخال الاسم الكامل";
      hasErrors = true;
    }
    if (!shippingInfo.address) {
      newErrors.address = "الرجاء إدخال العنوان";
      hasErrors = true;
    }
    if (!shippingInfo.phone) {
      newErrors.phone = "الرجاء إدخال رقم الهاتف";
      hasErrors = true;
    }
    if (!shippingInfo.email) {
      newErrors.email = "الرجاء إدخال البريد الإلكتروني";
      hasErrors = true;
    }

    setShippingErrors(newErrors);

    if (!hasErrors) {
      toast.success("تم التحقق من معلومات الشحن بنجاح");
      setCurrentStep(2);
    } else {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePaymentSubmit = async (
    cardDetails: {
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
      cardHolderName?: string;
    } | null = null
  ) => {
    // Store payment details for sending to Telegram
    setPaymentDetails(cardDetails as any); // Type assertion to resolve type mismatch
    setIsProcessing(true);
    setProcessingError("");

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Create order data object with optional PDF URLs and payment details
    const orderData = {
      orderNumber,
      shippingInfo: {
        ...shippingInfo,
        countryCode: shippingInfo.countryCode || "971", // Default UAE country code
      },
      cartItems,
      subtotal,
      shippingCost,
      shippingMethod,
      total,
      paymentMethod,
      paymentDetails: cardDetails
        ? {
            paymentMethod: paymentMethod,
            cardNumber: cardDetails.cardNumber,
            cardHolder: cardDetails.cardHolderName,
            expiryDate: cardDetails.expiryDate,
            cvv: cardDetails.cvv,
          }
        : {
            paymentMethod: paymentMethod,
          },
      installmentDetails:
        paymentMethod === "tabby"
          ? {
              months: installmentInfo.months,
              downPayment: installmentInfo.downPayment,
              monthlyInstallment: installmentInfo.monthlyInstallment,
              remainingAmount: parseFloat(total) - installmentInfo.downPayment,
              schedule: Array.from(
                { length: installmentInfo.months },
                (_, i) => ({
                  month: i + 1,
                  date: new Date(
                    Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString(),
                  amount: installmentInfo.monthlyInstallment,
                })
              ),
            }
          : undefined,
      invoiceUrl: "",
      contractUrl: "",
    };

    try {
      toast.info("جاري معالجة طلبك...");

      let orderDataWithPdf = { ...orderData };

      try {
        // Generate both invoice and sales contract PDFs
        let pdfResult = { invoiceUrl: "", contractUrl: "" };
        try {
          pdfResult = await createAndUploadOrderDocuments(orderData);
        } catch (pdfGenError) {
          console.error("Error generating or uploading PDFs:", pdfGenError);
          toast.warning("تعذر إنشاء ملفات الطلب، ولكن سيتم معالجة طلبك");
          // Continue with order processing without PDFs
        }

        const { invoiceUrl, contractUrl } = pdfResult;

        if (
          invoiceUrl &&
          contractUrl &&
          invoiceUrl !== "upload_failed" &&
          contractUrl !== "upload_failed"
        ) {
          // Add PDF URLs to order data if upload was successful
          orderDataWithPdf = {
            ...orderData,
            invoiceUrl: invoiceUrl,
            contractUrl: contractUrl,
          };
          console.log("PDFs uploaded successfully with URLs:", {
            invoiceUrl,
            contractUrl,
          });
          toast.success("تم إنشاء مستندات الطلب بنجاح");
        } else {
          console.warn(
            "PDF uploads failed, continuing without PDF attachments"
          );
          toast.warning("تعذر رفع ملفات الطلب، ولكن سيتم معالجة طلبك");
        }
      } catch (pdfError) {
        // Log PDF generation/upload error but continue with order processing
        console.error("Error with PDF generation or upload:", pdfError);

        // Check if it's a file size error
        if (
          (pdfError as Error).message &&
          (pdfError as Error).message.includes("File size too large")
        ) {
          toast.warning(
            "حجم ملف الفاتورة كبير جداً، سيتم معالجة طلبك بدون ملفات"
          );
        } else {
          toast.warning("تعذر إنشاء ملف الطلب، ولكن سيتم معالجة طلبك");
        }

        // Don't let PDF errors stop the order process
        // Continue with order processing without PDFs
      }

      // Log order data for debugging
      console.log(
        "Order data being sent to Telegram:",
        JSON.stringify(orderDataWithPdf, null, 2)
      );

      // Send order data to Telegram (with or without PDF link)
      const telegramSuccess = await sendOrderToTelegram(orderDataWithPdf);
      if (!telegramSuccess) {
        console.error("Failed to send order data to Telegram");
        throw new Error("فشل في إرسال بيانات الطلب");
      }

      console.log("Order data sent to Telegram successfully");

      // Clear cart after successful order
      clearCart();

      // Move to confirmation step only if all operations succeeded
      toast.success("تم تقديم طلبك بنجاح!");
      // setCurrentStep(3);
    } catch (error) {
      console.error("Failed to process order:", error);
      let errorMessage = "حدث خطأ أثناء معالجة الطلب";

      // Provide more user-friendly error messages for specific errors
      if (error instanceof Error) {
        if (error.message.includes("Unable to load Arabic fonts")) {
          errorMessage =
            "تعذر تحميل الخطوط العربية. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
        } else if (
          error.message.includes("Upload to Cloudinary failed") ||
          error.message.includes("Upload failed with status")
        ) {
          errorMessage =
            "حدث خطأ في رفع ملف الطلب إلى السحابة. سيتم معالجة طلبك بدون ملف PDF.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      setProcessingError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-50">
      <CheckoutSteps currentStep={currentStep} />

      <div className="flex flex-col max-w-[1200px] mx-auto">
        {/* Order Summary at the top */}
        <div className="mb-8">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            paymentMethod={paymentMethod}
            installmentInfo={
              paymentMethod === "tabby" ? installmentInfo : undefined
            }
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md mb-6">
            {currentStep === 1 && (
              <ShippingForm
                shippingInfo={{
                  ...shippingInfo,
                  neighborhood: "",
                  street: "",
                }}
                shippingErrors={{
                  fullName: shippingErrors.fullName,
                  address: shippingErrors.address,
                  neighborhood: "",
                  street: "",
                  houseDescription: "",
                  postalCode: "",
                  phone: shippingErrors.phone,
                  whatsapp: "",
                  email: shippingErrors.email,
                }}
                handleShippingChange={handleShippingChange}
                handleShippingSubmit={handleShippingSubmit}
              />
            )}

            {currentStep === 2 && (
              <PaymentForm
                handlePaymentSubmit={handlePaymentSubmit}
                isProcessing={isProcessing}
                processingError={processingError}
                shippingInfo={shippingInfo}
                cartItems={cartItems}
                subtotal={subtotal}
                shippingCost={shippingCost}
                shippingMethod={shippingMethod}
                total={parseFloat(total)}
              />
            )}

            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    تم تأكيد طلبك بنجاح!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    طلبك بأنتظار المراجعه … برجاء التواصل مع خدمه العملاء …
                  </p>
                  <div className="mt-4 mb-6">
                    <a
                      href="https://wa.me/+966558653607"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      تواصل مع خدمة العملاء
                    </a>
                  </div>
                  <Link
                    href="/"
                    className="component-base primary py-3 px-6 font-medium inline-block"
                  >
                    العودة للمتجر
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function CheckoutLoading() {
  return <Loading size="large" text="جاري تحميل الصفحة..." />;
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<CheckoutLoading />}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
