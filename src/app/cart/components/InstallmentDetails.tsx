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
  const calculateInstallmentDates = () => {
    const today = new Date();
    const installmentDates = Array.from(
      { length: installmentMonths },
      (_, i) => {
        const date = new Date(today);
        date.setMonth(today.getMonth() + i + 1);
        return {
          date: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          amount: monthlyInstallment, // Include the amount
        };
      }
    );
    console.log("Installment Details:", installmentDates); // Log the installment details
    localStorage.setItem("payments", JSON.stringify(installmentDates)); // Save to localStorage
    return installmentDates;
  };

  const saveInstallmentSchedule = () => {
    const installmentSchedule = calculateInstallmentDates().map(
      (date, index) => ({
        month: index + 1,
        date,
        amount: monthlyInstallment,
      })
    );
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const months = parseInt(e.target.value);
    setInstallmentMonths(months);
    saveInstallmentSchedule(); // Automatically save the schedule
  };

  return (
    <div className="mt-3 p-4 border rounded-md bg-gray-50">
      <div className="space-y-4">
        <div>
          <label className="block text-right mb-2 font-medium">
            اختر عدد شهور التقسيط
          </label>
          <select
            className="w-full p-2 border rounded-md text-right"
            onChange={handleMonthChange}
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
            420 د.إ
          </div>
        </div>
      </div>
      <h4 className="font-medium mb-3 text-right mt-4">جدول الأقساط الشهرية</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-white rounded border-b-2 border-primary">
          <span className="text-primary font-bold">
            420 د.إ
          </span>
          <span className="font-bold">الدفعة الأولى</span>
        </div>
        {calculateInstallmentDates().map((entry, index) => (
          <div
            key={index + 1}
            className="flex justify-between items-center p-2 bg-white rounded"
          >
            <div>
              <span className="text-primary font-medium">
                {entry.amount} د.إ
              </span>
              <div className="text-sm text-gray-500">{entry.date}</div>
            </div>
            <span>الشهر {index + 1}</span>
          </div>
        ))}
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
