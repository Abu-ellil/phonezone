"use client";

import InstallmentDetails from "./InstallmentDetails";
import DeliveryInfoForm from "./DeliveryInfoForm";

type CashOnDeliveryInstallmentFormProps = {
  shippingCost: number;
  installmentMonths: number;
  setInstallmentMonths: (months: number) => void;
  downPayment: number;
  handleDownPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalAmount: number;
  monthlyInstallment: string;
  remainingAmount: number;
  onDeliveryInfoSubmit?: () => void;
  onPayNowClick?: () => void;
};

export default function CashOnDeliveryInstallmentForm({
  shippingCost,
  installmentMonths,
  setInstallmentMonths,
  downPayment,
  handleDownPaymentChange,
  totalAmount,
  monthlyInstallment,
  remainingAmount,
  onDeliveryInfoSubmit,
  onPayNowClick,
}: CashOnDeliveryInstallmentFormProps) {
  return (
    <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-md">
      <div className="text-right mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          معلومات التوصيل للدفع بالتقسيط
        </h3>
        <p className="text-gray-600 mt-2">
          سيتم دفع رسوم التوصيل فقط الآن ({shippingCost} د.إ) والباقي بالتقسيط
          عند الاستلام
        </p>
      </div>

      <div className="space-y-4">
        <InstallmentDetails
          installmentMonths={installmentMonths}
          setInstallmentMonths={setInstallmentMonths}
          downPayment={downPayment}
          handleDownPaymentChange={handleDownPaymentChange}
          totalAmount={totalAmount}
          monthlyInstallment={monthlyInstallment}
          remainingAmount={remainingAmount}
        />

        <DeliveryInfoForm
          onDeliveryInfoSubmit={onDeliveryInfoSubmit}
          onPayNowClick={onPayNowClick}
        />
      </div>
    </div>
  );
}
