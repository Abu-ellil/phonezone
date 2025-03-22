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
    countryCode: string;
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
            <span>
              +{shippingInfo.countryCode}-{shippingInfo.phone}
            </span>
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
