"use client";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import Header from "@/components/Header";
import PaymentMethodRadio from "./components/PaymentMethodRadio";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getAppSettings } from "@/utils/appSettings";

export default function CartPage() {
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shippingMethod, setShippingMethod] = useState("aramex");
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [currentStep, setCurrentStep] = useState(1);
  const [installmentMonths, setInstallmentMonths] = useState(3);
  const [downPayment, setDownPayment] = useState(420);
  const [monthlyInstallment, setMonthlyInstallment] = useState("0.00");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cartData = useCart();
  const { cartItems, removeFromCart, updateQuantity } = cartData;

  // Handle cart data loading
  useEffect(() => {
    if (!cartData) {
      console.error("Cart context error");
      setError("Failed to load cart data. Please refresh the page.");
    }
  }, [cartData]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getAppSettings();
        if (
          "installmentDefaults" in settings &&
          settings.installmentDefaults &&
          typeof settings.installmentDefaults === "object" &&
          "months" in settings.installmentDefaults
        ) {
          setInstallmentMonths(Number(settings.installmentDefaults.months));
          setDownPayment(420);
        }
      } catch (error) {
        console.error("Error fetching installment defaults:", error);
        // Fallback to default values if Firebase fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);
  if (loading) {
    return <Loading size="large" text="جاري تحميل السلة..." />;
  }

  const handleNextStep = () => {
    console.log(
      "Current Step:",
      currentStep,
      "Shipping Method:",
      shippingMethod
    );

    // Force update the current step if we're in step 1
    if (currentStep === 1 && shippingMethod) {
      console.log("Attempting to move to step 2");
      // Use setTimeout to ensure state update happens
      setTimeout(() => {
        setCurrentStep(2);
        console.log("Step should now be 2");
      }, 100);
    } else if (currentStep === 2 && paymentMethod) {
      const total =
        paymentMethod === "cash_on_delivery" ||
        paymentMethod === "cash_on_delivery_cash" ||
        paymentMethod === "cash_on_delivery_installment"
          ? shippingCost
          : totalWithShipping;

      // Get installment info if payment method is tabby
      let url = `/checkout?total=${total}&paymentMethod=${paymentMethod}&shippingMethod=${shippingMethod}`;

      // Add installment information to URL if payment method is tabby
      if (paymentMethod === "tabby" && installmentMonths && downPayment) {
        url += `&installmentMonths=${installmentMonths}&downPayment=${downPayment}&monthlyInstallment=${monthlyInstallment}`;
      }

      window.location.href = url;
    }
  };

  const handlePayNowClick = () => {
    handleNextStep();
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total: number, item: { price: number; quantity: number }) => {
        return total + (item.price || 0) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const getShippingCost = () => {
    return shippingMethod === "aramex" ? 45 : 24;
  };

  const shippingCost = getShippingCost();
  const totalWithShipping = parseFloat(calculateTotal()) + shippingCost;
  const formattedTotal = `${totalWithShipping.toFixed(2)} د.إ`;

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div
            className={`flex items-center ${
              currentStep >= 1 ? "text-primary" : "text-gray-400"
            }}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300"
              }`}
            >
              1
            </div>
            <span className="mr-2">اختيار التوصيل</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div
            className={`flex items-center ${
              currentStep >= 2 ? "text-primary" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300"
              }`}
            >
              2
            </div>
            <span className="mr-2">طريقة الدفع</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderStepIndicator()}
        <div className="flex flex-col gap-6 items-center">
          {/* Order Summary Section */}

          {cartItems.length > 0 && (
            <div className="lg:w-1/3 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 text-right">
                    ملخص الطلب
                  </h2>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-medium">
                      {calculateTotal() + " د.إ"}
                    </span>
                    <span className="text-gray-700">مجموع المنتجات</span>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  {currentStep === 1 && (
                    <div className="mb-4">
                      <div className="text-right text-red-500 mb-2 font-bold">
                        اختر شركة التوصيل
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center p-2 text-blue-500 text-xl">
                            <div className="flex-1 text-right">45 د.إ</div>
                          </div>
                          <div
                            className={`flex w-40 items-center p-2 border rounded-md cursor-pointer ${
                              shippingMethod === "aramex"
                                ? "border-primary bg-blue-50"
                                : "border-gray-300"
                            }`}
                            onClick={() => setShippingMethod("aramex")}
                          >
                            <div className="flex-1 text-right">
                              <div className="font-medium">أرامكس</div>
                            </div>
                            <div className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded-full mr-2">
                              {shippingMethod === "aramex" && (
                                <div className="w-3 h-3 bg-primary rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 items-center">
                          <div className="flex items-center p-2 text-blue-500 text-xl">
                            <div className="flex-1 text-right">24 د.إ</div>
                          </div>
                          <div
                            className={`flex w-40 items-center p-2 border rounded-md cursor-pointer ${
                              shippingMethod === "smsa"
                                ? "border-primary bg-blue-50"
                                : "border-gray-300"
                            }`}
                            onClick={() => setShippingMethod("smsa")}
                          >
                            <div className="flex-1 text-right">
                              <div className="font-medium">سمسا</div>
                            </div>
                            <div className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded-full mr-2">
                              {shippingMethod === "smsa" && (
                                <div className="w-3 h-3 bg-primary rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          console.log(
                            "Button clicked, current step:",
                            currentStep
                          );
                          handleNextStep();
                        }}
                        className="w-full component-base primary py-3 px-6 font-medium mt-4"
                      >
                        التالي
                      </button>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <PaymentMethodRadio
                        total={totalWithShipping}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        shippingCost={shippingCost}
                        onPayNowClick={handlePayNowClick}
                        onDeliveryInfoSubmit={handlePayNowClick}
                        installmentMonths={installmentMonths}
                        setInstallmentMonths={setInstallmentMonths}
                        downPayment={downPayment}
                        setDownPayment={setDownPayment}
                        setMonthlyInstallment={setMonthlyInstallment}
                      />
                      {paymentMethod !== "cash_on_delivery" && (
                        <button
                          onClick={handleNextStep}
                          className="w-full component-base warning py-3 px-6 font-medium"
                        >
                          التالي
                        </button>
                      )}
                    </div>
                  )}

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="space-y-2">
                    {paymentMethod === "tabby" && (
                      <div className="bg-blue-50 p-4 rounded-md mb-3 border border-blue-200">
                        <h3 className="font-bold text-right mb-3 text-blue-800">
                          معلومات التقسيط
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-white rounded border-r-4 border-primary">
                            <span className="text-primary font-medium">
                              {installmentMonths}{" "}
                              {installmentMonths === 1
                                ? "شهر"
                                : installmentMonths === 2
                                ? "شهرين"
                                : "شهور"}
                            </span>
                            <span className="font-medium">مدة التقسيط:</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border-r-4 border-primary">
                            <span className="text-primary font-medium">
                              {downPayment.toFixed(2)} د.إ
                            </span>
                            <span className="font-medium">الدفعة الأولى:</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border-r-4 border-primary">
                            <span className="text-primary font-medium">
                              {monthlyInstallment} د.إ
                            </span>
                            <span className="font-medium">القسط الشهري:</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                          <span className="font-bold text-primary">
                            {totalWithShipping.toFixed(2)} د.إ
                          </span>
                          <span className="font-medium">المبلغ الإجمالي</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold">
                        {shippingCost} د.إ
                      </span>
                      <span className="text-gray-700 font-bold">
                        رسوم التوصيل
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-primary text-lg">
                        {formattedTotal}
                      </span>
                      <span className="text-gray-900">الإجمالي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items Section */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 bg-white border-b border-gray-200 text-right">
                <h1 className="text-xl font-bold">سلة التسوق</h1>
              </div>

              {cartItems.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {cartItems.map(
                    (item: {
                      id: string;
                      quantity: number;
                      name: string;
                      category: string;
                      price: number;
                      image_url: string;
                    }) => (
                      <div key={item.id} className="p-4 flex items-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>

                        <div className="flex items-center ml-4">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-r-md"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-t border-b border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-l-md"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex-1 flex items-center">
                          <div className="flex-1 text-right mr-4">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.category}
                            </p>
                            <div className="mt-1">
                              <span className="text-lg font-bold text-primary">
                                {item.price}
                              </span>
                            </div>
                          </div>
                          <div className="w-20 h-20 relative">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              style={{ objectFit: "contain" }}
                              sizes="80px"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center py-16">
                  <div className="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-6 text-lg">السلة فارغة</p>
                  <Link
                    href="/"
                    className="inline-block bg-[#3498db] text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    العودة للمتجر
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
