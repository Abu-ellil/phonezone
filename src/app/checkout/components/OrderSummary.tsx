"use client";
import Image from "next/image";
import { CartItem } from "@/contexts/CartContext";
type OrderSummaryProps = {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: string;
  paymentMethod?: string;
  installmentInfo?: {
    months: number;
    downPayment: number;
    monthlyInstallment: string;
  };
};

export default function OrderSummary({
  cartItems,
  subtotal,
  shippingCost,
  total,
  paymentMethod,
  installmentInfo,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-6">
      {paymentMethod === "cash_on_delivery" ? (
        <div className="bg-red-50 p-3 rounded-md text-right">
          <p className="text-sm text-red-600">
            <span className="font-medium">ملاحظة:</span> سيتم دفع رسوم التوصيل
            فقط ({shippingCost} د.إ) الآن، وسيتم دفع باقي المبلغ (
            {subtotal.toFixed(2)} د.إ) عند استلام الطلب
          </p>
        </div>
      ) : (
        <div className="bg-red-50 p-3 rounded-md text-right">
          <p className="text-sm text-red-800">
            <span className="font-medium">ملاحظة:</span> سيتم تأكيد طلبك بعد
            التحقق من معلومات الدفع
          </p>
        </div>
      )}
      <h2 className="text-lg font-bold mb-4 text-right">ملخص الطلب</h2>

      <div className="mb-6">
        <div className="max-h-60 overflow-y-auto mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 mb-3">
              <div className="flex-1 text-right">
                <p className="text-sm font-medium">{item.name}</p>
                <div className="flex justify-start items-center gap-2">
                  <span className="text-xs text-gray-500">
                    الكمية: {item.quantity}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Number(item.price).toFixed(2)} د.إ
                  </span>
                </div>
              </div>
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="48px"
                />
              </div>
            </div>
          ))}
        </div>

        {paymentMethod === "tabby" && installmentInfo && (
          <div className="bg-red-50 p-4 rounded-md mb-3 border border-red-200">
            <h3 className="font-bold text-right mb-3 text-red-800">
              معلومات التقسيط
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-white rounded border-r-4 border-primary">
                <span className="text-primary font-medium">
                  {installmentInfo.months}{" "}
                  {installmentInfo.months === 1
                    ? "شهر"
                    : installmentInfo.months === 2
                    ? "شهرين"
                    : "شهور"}
                </span>
                <span className="font-medium">مدة التقسيط:</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border-r-4 border-primary">
                <span className="text-primary font-medium">
                  {installmentInfo.downPayment.toFixed(2)} د.إ
                </span>
                <span className="font-medium">الدفعة الأولى:</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border-r-4 border-primary">
                <span className="text-primary font-medium">
                  {installmentInfo.monthlyInstallment} د.إ
                </span>
                <span className="font-medium">القسط الشهري:</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-red-200 flex justify-between items-center">
              <span className="font-bold text-primary">
                {parseFloat(total).toFixed(2)} د.إ
              </span>
              <span className="font-medium">المبلغ الإجمالي</span>
            </div>
          </div>
        )}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-primary">{subtotal.toFixed(2)} د.إ</span>
            <span>المجموع الفرعي:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">{shippingCost.toFixed(2)} د.إ</span>
            <span>الشحن:</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <span className="font-bold text-primary">
              {parseFloat(total).toFixed(2)} د.إ
            </span>
            <span className="font-bold">الإجمالي:</span>
          </div>
        </div>
      </div>
    </div>
  );
}
