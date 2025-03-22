"use client";

import DeliveryInfoForm from "./DeliveryInfoForm";

type CashOnDeliveryCashFormProps = {
  shippingCost: number;
  onDeliveryInfoSubmit?: () => void;
  onPayNowClick?: () => void;
};

export default function CashOnDeliveryCashForm({
  shippingCost,
  onDeliveryInfoSubmit,
  onPayNowClick,
}: CashOnDeliveryCashFormProps) {
  return (
    <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-md">
      <div className="text-right mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          معلومات التوصيل للدفع نقداً
        </h3>
        <p className="text-gray-600 mt-2">
          سيتم دفع رسوم التوصيل فقط الآن ({shippingCost} د.إ) والباقي نقداً عند
          الاستلام
        </p>
      </div>

      <DeliveryInfoForm
        onDeliveryInfoSubmit={onDeliveryInfoSubmit}
        onPayNowClick={onPayNowClick}
      />
    </div>
  );
}
