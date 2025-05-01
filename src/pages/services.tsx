export default function Services() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">خدمة العملاء</h1>
      <p>محتوى صفحة خدمة العملاء هنا.</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">تواصل معنا عبر WhatsApp</h2>
        <p>
          يمكنك التواصل معنا عبر WhatsApp على الرقم التالي:
          <a
            href="http://wa.me/971547675648"
            className="text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            +971 54 767 5648
          </a>
        </p>
      </div>
    </div>
  );
}
