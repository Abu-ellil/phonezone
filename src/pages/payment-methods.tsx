export default function PaymentMethods() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">طرق الدفع</h1>
      <p>يسعدنا استقبال مدفوعاتكم عبر:</p>
      <ul className="list-disc list-inside mt-4">
        <li>بطاقة الصراف مدى MADA</li>
        <li>ماستر كارد Master Card</li>
        <li>فيزا Visa</li>
      </ul>
    </div>
  );
}