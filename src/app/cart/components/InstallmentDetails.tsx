"use client";

type InstallmentDetailsProps = {
  installmentMonths: number;
  setInstallmentMonths: (months: number) => void;
  downPayment: number;
  handleDownPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalAmount: number;
  monthlyInstallment: string;
  remainingAmount: number;
};

export default function InstallmentDetails({
  installmentMonths,
  setInstallmentMonths,
  downPayment,
  handleDownPaymentChange,
  totalAmount,
  monthlyInstallment,
  remainingAmount,
}: InstallmentDetailsProps) {
  return (
    <div className="mt-3 p-4 border rounded-md bg-gray-50">
      <div className="space-y-4">
        <div>
          <label className="block text-right mb-2 font-medium">
            اختر عدد شهور التقسيط
          </label>
          <select
            className="w-full p-2 border rounded-md text-right"
            onChange={(e) => setInstallmentMonths(parseInt(e.target.value))}
            value={installmentMonths}
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month === 1
                  ? "شهر واحد"
                  : month === 2
                  ? "شهرين"
                  : `${month} شهور`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-right mb-2 font-medium">
            الدفعة الأولى (د.إ)
          </label>
          <div className="w-full p-2 border rounded-md text-right font-bold text-primary">

          1000 د.إ
          </div>
          
        </div>
      </div>
      <h4 className="font-medium mb-3 text-right mt-4">جدول الأقساط الشهرية</h4>
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
  );
}
