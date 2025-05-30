"use client";

type PaymentMethodOptionProps = {
  method: string;
  currentMethod: string;
  label: string;
  description?: string;
  onSelect: (method: string) => void;
  className?: string;
};

export default function PaymentMethodOption({
  method,
  currentMethod,
  label,
  description,
  onSelect,
  className,
}: PaymentMethodOptionProps) {
  const isSelected = currentMethod === method;

  return (
    <div
      onClick={() => onSelect(method)}
      className={
        className ||
        `flex items-center p-3 border rounded-md hover:border-primary cursor-pointer ${
          isSelected ? "border-2 border-primary bg-blue-50" : "border-gray-300"
        }`
      }
    >
      <div className="flex-1 text-right">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
      <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full mr-3">
        {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
      </div>
    </div>
  );
}
