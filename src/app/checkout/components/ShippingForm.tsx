"use client";

import { toast } from "react-toastify";

type ShippingFormProps = {
  shippingInfo: {
    fullName: string;
    address: string;
    neighborhood: string;
    street: string;
    houseDescription: string;
    postalCode: string;
    countryCode: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  shippingErrors: {
    fullName: string;
    address: string;
    neighborhood: string;
    street: string;
    houseDescription: string;
    postalCode: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShippingSubmit: () => void;
};

export default function ShippingForm({
  shippingInfo,
  shippingErrors,
  handleShippingChange,
  handleShippingSubmit,
}: ShippingFormProps) {
  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "countryCode",
      "address",
    ];

    // التحقق من إدخال جميع الحقول المطلوبة
    const allFieldsFilled = requiredFields.every((field) =>
shippingInfo[field as keyof typeof shippingInfo]?.trim()
    );

    // التحقق من صحة صيغة البريد الإلكتروني
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailRegex.test(shippingInfo.email);

    // التحقق من أن رقم الهاتف ورمز البلد يحتويان على أرقام فقط
    const phoneNumberRegex = /^[0-9]+$/;
    const isPhoneValid = phoneNumberRegex.test(shippingInfo.phone);
    const isCountryCodeValid = phoneNumberRegex.test(shippingInfo.countryCode);

    return (
      allFieldsFilled && isEmailValid && isPhoneValid && isCountryCodeValid
    );
  };

  const onSubmit = () => {
    const requiredFields = [
      { field: "fullName", label: "الاسم الكامل" },
      { field: "email", label: "البريد الإلكتروني" },
      { field: "phone", label: "رقم الهاتف" },
      { field: "countryCode", label: "رمز البلد" },
      { field: "address", label: "العنوان" },
    ];

    const missingFields = requiredFields.filter(
({ field }) => !shippingInfo[field as keyof typeof shippingInfo]?.trim()
    );

    if (missingFields.length > 0) {
      missingFields.forEach(({ label }) => {
        toast.error(`الرجاء إدخال ${label}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: true,
        });
      });
      return;
    }

    // التحقق من صحة صيغة البريد الإلكتروني
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error("الرجاء إدخال بريد إلكتروني صحيح", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: true,
      });
      return;
    }

    // التحقق من أن رقم الهاتف يحتوي على أرقام فقط
    const phoneNumberRegex = /^[0-9]+$/;
    if (!phoneNumberRegex.test(shippingInfo.phone)) {
      toast.error("الرجاء إدخال أرقام فقط في رقم الهاتف", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: true,
      });
      return;
    }

    // التحقق من أن رمز البلد يحتوي على أرقام فقط
    if (!phoneNumberRegex.test(shippingInfo.countryCode)) {
      toast.error("الرجاء إدخال أرقام فقط في رمز البلد", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: true,
      });
      return;
    }

    handleShippingSubmit();
  };

  return (
    <div className="text-right">
      <h2 className="text-lg font-bold mb-4">معلومات الشحن</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            الاسم الكامل
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={shippingInfo.fullName}
            onChange={handleShippingChange}
            className={`w-full p-2 border ${
              shippingErrors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-md text-right`}
            required
          />
          {shippingErrors.fullName && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {shippingErrors.fullName}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={shippingInfo.email}
            onChange={handleShippingChange}
            className={`w-full p-2 border ${
              shippingErrors.email ? "border-red-500" : "border-gray-300"
            } rounded-md text-right`}
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          />
          {shippingErrors.email && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {shippingErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            رقم الهاتف
          </label>
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <input
              type="text"
              id="countryCode"
              name="countryCode"
              value={shippingInfo.countryCode}
              onChange={handleShippingChange}
              className="w-14 p-2 border border-gray-300 rounded-md text-right"
              placeholder="971+"
              pattern="[0-9]*"
              maxLength={3}
              required
            />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              className="flex-1 p-2 border border-gray-300 rounded-md text-right"
              placeholder="5xxxxxxxx"
              pattern="[0-9]*"
              required
            />
          </div>
          {shippingErrors.phone && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {shippingErrors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            العنوان
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            className={`w-full p-2 border ${
              shippingErrors.address ? "border-red-500" : "border-gray-300"
            } rounded-md text-right`}
            required
          />
          {shippingErrors.address && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {shippingErrors.address}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="houseDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            وصف البيت (اختياري)
          </label>
          <input
            type="text"
            id="houseDescription"
            name="houseDescription"
            value={shippingInfo.houseDescription}
            onChange={handleShippingChange}
            className="w-full p-2 border border-gray-300 rounded-md text-right"
          />
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="component-base primary w-full mt-4 py-2 rounded-md"
      >
        التالي
      </button>
    </div>
  );
}
