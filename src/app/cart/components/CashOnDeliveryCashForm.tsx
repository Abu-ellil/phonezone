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


      <DeliveryInfoForm
        onDeliveryInfoSubmit={onDeliveryInfoSubmit}
        onPayNowClick={onPayNowClick}
      />
    </div>
  );
}
