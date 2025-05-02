"use client";

import { useEffect, useState } from "react";
import PaymentMethodOption from "./PaymentMethodOption";
import InstallmentDetails from "./InstallmentDetails";
import DeliveryInfoForm from "./DeliveryInfoForm";
import CashOnDeliveryOptions from "./CashOnDeliveryOptions";
import CashOnDeliveryCashForm from "./CashOnDeliveryCashForm";
import CashOnDeliveryInstallmentForm from "./CashOnDeliveryInstallmentForm";

type PaymentMethodRadioProps = {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  showDeliveryInfo?: boolean;
  onDeliveryInfoSubmit?: () => void;
  shippingCost?: number;
  total?: number;
  onPayNowClick?: () => void;
  installmentMonths?: number;
  setInstallmentMonths?: (months: number) => void;
  downPayment?: number;
  setDownPayment?: (amount: number) => void;
  setMonthlyInstallment?: (amount: string) => void;
};

export default function PaymentMethodRadio({
  paymentMethod,
  setPaymentMethod,
  showDeliveryInfo = false,
  onDeliveryInfoSubmit,
  shippingCost = 0,
  total,
  onPayNowClick,
  installmentMonths = 3, // Changed default from 1 to 3 months
  setInstallmentMonths = () => {},
  downPayment = 420,
  setDownPayment = () => {},
  setMonthlyInstallment = () => {},
}: PaymentMethodRadioProps) {
  const [onDelevery, setOnDelevery] = useState(false);
  const totalAmount = total ?? 0;
  const remainingAmount = totalAmount - downPayment;
  const monthlyInstallment =
    remainingAmount > 0
      ? (remainingAmount / installmentMonths).toFixed(2)
      : "0.00";

  // Update monthly installment in parent component
  useEffect(() => {
    setMonthlyInstallment(monthlyInstallment);
  }, [monthlyInstallment, setMonthlyInstallment]);

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= totalAmount) {
      setDownPayment(420);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {/* Cash Payment Option */}
        <PaymentMethodOption
          method="cash"
          currentMethod={paymentMethod}
          label="دفع كامل المبلغ"
          onSelect={setPaymentMethod}
        />

        {/* Installment Payment Option */}
        <div>
          <PaymentMethodOption
            method="tabby"
            currentMethod={paymentMethod}
            label="الدفع بالتقسيط"
            onSelect={setPaymentMethod}
          />

          {paymentMethod === "tabby" && (
            <div>
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
          )}
        </div>

        {/* Cash on Delivery Option */}
        {/* <div  onClick={() => setOnDelevery(!onDelevery)}   >
          
        <PaymentMethodOption
          method="cash_on_delivery"
          currentMethod={paymentMethod}
          label="الدفع عند الاستلام"
          description={`دفع رسوم التوصيل فقط الآن (${shippingCost} د.إ) والباقي عند الاستلام`}
          onSelect={setPaymentMethod}
          />
          </div> */}
      </div>

      {/* Cash on Delivery Options */}
      {onDelevery &&
        <CashOnDeliveryOptions
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          shippingCost={shippingCost}
        />
      }

      {/* Cash on Delivery Cash Form */}
      {
        <CashOnDeliveryCashForm
          shippingCost={shippingCost}
          onDeliveryInfoSubmit={onDeliveryInfoSubmit}
          onPayNowClick={onPayNowClick}
        />
      }

      {/* Cash on Delivery Installment Form */}
      {paymentMethod === "cash_on_delivery_installment" && (
        <CashOnDeliveryInstallmentForm
          shippingCost={shippingCost}
          installmentMonths={installmentMonths}
          setInstallmentMonths={setInstallmentMonths}
          downPayment={downPayment}
          handleDownPaymentChange={handleDownPaymentChange}
          totalAmount={totalAmount}
          monthlyInstallment={monthlyInstallment}
          remainingAmount={remainingAmount}
          onDeliveryInfoSubmit={onDeliveryInfoSubmit}
          onPayNowClick={onPayNowClick}
        />
      )}
    </div>
  );
}
