"use client";

type DeliveryInfoFormProps = {
  onDeliveryInfoSubmit?: () => void;
  onPayNowClick?: () => void;
};

export default function DeliveryInfoForm({
  onDeliveryInfoSubmit,
  onPayNowClick,
}: DeliveryInfoFormProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
        رقم الهاتف
      </label>
      <div className="flex items-center gap-2 rtl:flex-row-reverse">
        <span className="text-gray-500 font-medium">+</span>
        <input
          type="text"
          className="w-20 p-2 border border-gray-300 rounded-md text-right"
          placeholder="971"
          pattern="[0-9]*"
          maxLength={3}
          required
        />
        <input
          type="tel"
          className="flex-1 p-2 border border-gray-300 rounded-md text-right"
          placeholder="5xxxxxxxx"
          pattern="[0-9]*"
          required
        />
      </div>
      <div className="mt-3">
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
      <div className="flex gap-3 mt-4">
        {onDeliveryInfoSubmit && (
          <button
            onClick={onDeliveryInfoSubmit}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          >
            دفع رسوم التوصيل
          </button>
        )}
        {onPayNowClick && (
          <button
            onClick={onPayNowClick}
            className="flex-1 bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
          >
            الدفع الآن
          </button>
        )}
      </div>
    </div>
  );
}
