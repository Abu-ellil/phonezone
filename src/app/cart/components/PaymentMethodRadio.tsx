"use client";

import {  useEffect } from "react";

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
  downPayment = 1000,
  setDownPayment = () => {},
  setMonthlyInstallment = () => {},
}: PaymentMethodRadioProps) {
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
      setDownPayment(value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div
          onClick={() => setPaymentMethod("cash")}
          className={`flex items-center p-3 border rounded-md hover:border-primary cursor-pointer ${
            paymentMethod === "cash"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        >
          <div className="flex-1 text-right">
            <div className="font-medium">الدفع نقداً</div>
          </div>
          <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full mr-3">
            {paymentMethod === "cash" && (
              <div className="w-4 h-4 bg-primary rounded-full bg-blue-500"></div>
            )}
          </div>
        </div>

        <div>
          <div
            onClick={() => setPaymentMethod("tabby")}
            className={`flex items-center p-3 border rounded-md hover:border-primary cursor-pointer ${
              paymentMethod === "tabby"
                ? "border-primary bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <div className="flex-1 text-right">
              <div className="font-medium">الدفع بالتقسيط</div>
            </div>
            <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full mr-3">
              {paymentMethod === "tabby" && (
                <div className="w-4 h-4 bg-primary rounded-full bg-blue-600"></div>
              )}
            </div>
          </div>

          {paymentMethod === "tabby" && (
            <div className="mt-3 p-4 border rounded-md bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-right mb-2 font-medium">
                    اختر عدد شهور التقسيط
                  </label>
                  <select
                    className="w-full p-2 border rounded-md text-right"
                    onChange={(e) =>
                      setInstallmentMonths(parseInt(e.target.value))
                    }
                    value={installmentMonths}
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {month === 1
                            ? "شهر واحد"
                            : month === 2
                            ? "شهرين"
                            : `${month} شهور`}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-right mb-2 font-medium">
                    الدفعة الأولى (د.إ)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md text-right"
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                    min="0"
                    max={totalAmount}
                    step="100"
                  />
                </div>
              </div>
              <h4 className="font-medium mb-3 text-right">
                جدول الأقساط الشهرية
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white rounded border-b-2 border-primary">
                  <span className="text-primary font-bold">
                    {downPayment.toFixed(2)} د.إ
                  </span>
                  <span className="font-bold">الدفعة الأولى</span>
                </div>
                {Array.from({ length: installmentMonths }, (_, i) => i + 1).map(
                  (month) => (
                    <div
                      key={month}
                      className="flex justify-between items-center p-2 bg-white rounded"
                    >
                      <span className="text-primary font-medium">
                        {monthlyInstallment} د.إ
                      </span>
                      <span>الشهر {month}</span>
                    </div>
                  )
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-primary">
                  {totalAmount.toFixed(2)} د.إ
                </span>
                <span className="font-medium">المبلغ الإجمالي</span>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
                <span>{remainingAmount.toFixed(2)} د.إ</span>
                <span>المبلغ المتبقي بعد الدفعة الأولى</span>
              </div>
            </div>
          )}
        </div>

        <div
          onClick={() => setPaymentMethod("cash_on_delivery")}
          className={`flex items-center p-3 border rounded-md hover:border-primary cursor-pointer ${
            paymentMethod === "cash_on_delivery"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        >
          <div className="flex-1 text-right">
            <div className="font-medium">الدفع عند الاستلام</div>
            <div className="text-sm text-gray-500">
              دفع رسوم التوصيل فقط الآن ({shippingCost} د.إ) والباقي عند
              الاستلام
            </div>
          </div>
          <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full mr-3">
            {paymentMethod === "cash_on_delivery" && (
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {paymentMethod === "cash_on_delivery" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-right mb-4">
              <h3 className="text-lg font-bold text-gray-900">تنبيه</h3>
              <p className="text-gray-600 mt-2">
                عند اختيار الدفع عند الاستلام، سيتم دفع رسوم التوصيل فقط الآن
              </p>
              <p className="text-xl font-bold text-primary mt-3">
                {shippingCost} د.إ
              </p>
              <p className="text-sm text-gray-600 mt-2">
                سيتم دفع باقي المبلغ عند استلام الطلب
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={onDeliveryInfoSubmit}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                دفع رسوم التوصيل
              </button>
              <button
                onClick={onPayNowClick}
                className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
              >
                الدفع الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeliveryInfo && paymentMethod === "cash_on_delivery" && (
        <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              رقم الهاتف
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-md text-right"
              placeholder="أدخل رقم الهاتف"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              العنوان
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-right"
              rows={3}
              placeholder="أدخل العنوان بالتفصيل"
              required
            />
          </div>
          <button
            onClick={onDeliveryInfoSubmit}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          >
            تأكيد معلومات التوصيل
          </button>
        </div>
      )}
    </div>
  );
}
