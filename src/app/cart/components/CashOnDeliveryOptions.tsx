"use client";

import PaymentMethodOption from "./PaymentMethodOption";

type CashOnDeliveryOptionsProps = {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  shippingCost: number;
};

export default function CashOnDeliveryOptions({
  paymentMethod,
  setPaymentMethod,
  shippingCost,
}: CashOnDeliveryOptionsProps) {
  return (
    <div className="mt-3 p-4 border rounded-md bg-gray-50">
      <div className="text-right mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          اختر طريقة الدفع عند الاستلام
        </h3>
        <p className="text-gray-600 mt-2">
          سيتم دفع رسوم التوصيل فقط الآن ({shippingCost} د.إ) والباقي عند
          الاستلام
        </p>
      </div>

      <div className="space-y-3">
        <PaymentMethodOption
          method="cash_on_delivery_cash"
          currentMethod={paymentMethod}
          label="دفع كامل المبلغ "
          onSelect={setPaymentMethod}
          className={`p-4 border rounded-md cursor-pointer ${
            paymentMethod === "cash_on_delivery_cash"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        />

        <PaymentMethodOption
          method="cash_on_delivery_installment"
          currentMethod={paymentMethod}
          label="الدفع بالتقسيط عند الاستلام"
          onSelect={setPaymentMethod}
          className={`p-4 border rounded-md cursor-pointer ${
            paymentMethod === "cash_on_delivery_installment"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        />
      </div>
    </div>
  );
}