"use client";
import Image from "next/image";
import { CartItem } from "@/contexts/CartContext";

type OrderReviewProps = {
  shippingInfo: {
    fullName: string;
    address: string;
    postalCode: string;
    phone: string;
    email: string;
  };
  paymentInfo: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
  cartItems: CartItem[];
};

export default function OrderReview({
  shippingInfo,
  paymentInfo,
  cartItems,
}: OrderReviewProps) {
  return (
    <div className="text-right">
      <h2 className="text-lg font-bold mb-4">مراجعة الطلب</h2>

      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">معلومات الشحن</h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="mb-1">
            <span className="font-medium">الاسم:</span> {shippingInfo.fullName}
          </p>
          <p className="mb-1">
            <span className="font-medium">العنوان:</span> {shippingInfo.address}
          </p>
          <p className="mb-1">
            <span className="font-medium">الرمز البريدي:</span>{" "}
            {shippingInfo.postalCode}
          </p>
          <p className="mb-1">
            <span className="font-medium">رقم الهاتف:</span>{" "}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                رقم الهاتف
              </label>
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <span className="text-gray-500 font-medium">+</span>
                <input
                  type="text"
                  id="countryCode"
                  name="countryCode"
                  className="w-20 p-2 border border-gray-300 rounded-md text-right"
                  placeholder="971"
                  pattern="[0-9]*"
                  maxLength={3}
                  required
                  disabled
                />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-right"
                  placeholder="5xxxxxxxx"
                  pattern="[0-9]*"
                  required
                  disabled
                />
              </div>
            </div>
          </p>
          <p>
            <span className="font-medium">البريد الإلكتروني:</span>{" "}
            {shippingInfo.email}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">معلومات الدفع</h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="mb-1">
            <span className="font-medium">رقم البطاقة:</span> **** **** ****{" "}
            {paymentInfo.cardNumber.slice(-4)}
          </p>
          <p className="mb-1">
            <span className="font-medium">اسم حامل البطاقة:</span>{" "}
            {paymentInfo.cardHolder}
          </p>
          <p>
            <span className="font-medium">تاريخ الانتهاء:</span>{" "}
            {paymentInfo.expiryDate}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">المنتجات</h3>
        <div className="divide-y divide-gray-200 bg-gray-50 p-3 rounded-md">
          {cartItems.map((item) => (
            <div key={item.id} className="py-3 flex items-center gap-3">
              <div className="flex-1 text-right">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
              </div>
              <div className="relative h-16 w-16">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="64px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
