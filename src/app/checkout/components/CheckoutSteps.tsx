"use client";

type CheckoutStepProps = {
  currentStep: "shipping" | "payment" | "review" | number;
};

export default function CheckoutSteps({ currentStep }: CheckoutStepProps) {
  // Convert number to string type if needed
  const step =
    typeof currentStep === "number"
      ? currentStep === 1
        ? "shipping"
        : currentStep === 2
        ? "payment"
        : "review"
      : currentStep;

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-center">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "shipping" || step === "payment" || step === "review"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className="mx-2 text-sm font-medium">معلومات الشحن</div>
          <div className="w-12 h-1 bg-gray-200 mx-2">
            <div
              className={`h-full ${
                step === "payment" || step === "review"
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            ></div>
          </div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "payment" || step === "review"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className="mx-2 text-sm font-medium">الدفع</div>
          <div className="w-12 h-1 bg-gray-200 mx-2">
            <div
              className={`h-full ${
                step === "review" ? "bg-primary" : "bg-gray-200"
              }`}
            ></div>
          </div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "review"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
          <div className="mx-2 text-sm font-medium">مراجعة الطلب</div>
        </div>
      </div>
    </div>
  );
}
