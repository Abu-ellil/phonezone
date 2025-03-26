export default function PaymentMethods() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-md" dir="rtl"> {/* Added dir="rtl" and improved styling */}
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">طرق الدفع</h1> {/* Enhanced heading style */}
      <p className="text-lg text-center mb-4">يسعدنا استقبال مدفوعاتكم عبر:</p> {/* Enhanced paragraph style */}
      <ul className="list-disc list-inside mt-4 space-y-2 text-lg"> {/* Added spacing and text size */}
        <li>بطاقة الصراف مدى MADA</li>
        <li>ماستر كارد Master Card</li>
        <li>فيزا Visa</li>
      </ul>
    </div>
  );
}