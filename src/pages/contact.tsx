export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl"> {/* Added dir="rtl" */}
      <h1 className="text-2xl font-bold mb-4">تواصل معنا</h1>
      <p>محتوى صفحة التواصل هنا.</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">معلومات الاتصال</h2>
        <ul className="space-y-2">
          <li>
            <span className="font-bold">الهاتف:</span> +971 54 767 5648
          </li>
          <li>
            <span className="font-bold">البريد الإلكتروني:</span> Phonezonemobile3@gmail.com
          </li>
          <li>
            <span className="font-bold">العنوان:</span> الإمارات العربية المتحدة
          </li>
        </ul>
      </div>
    </div>
  );
}