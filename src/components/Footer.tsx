import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط مهمة</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  سياسة الخصوصية والشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-white transition-colors duration-200">
                  طرق الدفع والاقساط
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors duration-200">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors duration-200">
                  آلية الاسترجاع
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors duration-200">
                  خدمة العملاء
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-end">
                <a href="http://wa.me//971547675648" className="hover:text-white transition-colors duration-200 flex items-center">
                  <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5 ml-2" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li className="flex items-center justify-end">
                <span>+971 54 767 5648</span>
              </li>
              <li className="flex items-center justify-end">
                <span>Phonezonemobile3@gmail.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تابعنا على</h3>
            <div className="flex space-x-4 space-x-reverse">
              <a href="https://www.facebook.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a href="https://www.twitter.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">فون زون</h3>
            <p className="mb-4 text-sm">
              &quot;فون زون&quot;، تأسس في عام 2016 كشركة تجارة إلكترونية متخصصة تقدم لك أفضل المنتجات بأفضل الأسعار. هدفنا دائماً هو تقديم خدمة تجعلك أكثر ذكاء وسهولة من خلال تسوقك في &quot;فون زون&quot;.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-sm">© 2016 فون زون</p>
        </div>
      </div>
    </footer>
  );
}
