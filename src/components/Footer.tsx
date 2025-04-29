import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import trda from "../../public/images/TDRALogo.webp";
import government from "../../public/images/government-ae-logo-arabic2.webp";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-800 via-blue-500 to-blue-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
          <div>
            <h3 className="text-lg font-semibold mb-4">من نحن</h3>
            <p className="mb-4 text-sm">
              مؤسسة AliiexpressUAE هي شركة رائدة تقدم خدماتها في مجال الاتصالات
              والهواتف المحمولة منذ 2016 كموزع معتمد من شركة آبل في الامارات
              العربية المتحدة.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط مهمة</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  سياسة الخصوصية والشروط والأحكام
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors duration-200"
                >
                  خدمة العملاء
                </Link>
              </li>
              <li>
                <Link
                  href="/payment-methods"
                  className="hover:text-white transition-colors duration-200"
                >
                  طرق الدفع
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-start">
                <a
                  href="http://wa.me//971547675648"
                  className="hover:text-white transition-colors duration-200 flex items-center"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5 ml-2" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li className="flex items-center justify-start">
                <span>971547675648</span>+
              </li>
              <li className="flex items-center justify-start">
                <span>Phonezonemobile3@gmail.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تابعنا على</h3>
            <div className="flex space-x-reverse">
              <a
                href="https://www.facebook.com"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a
                href="https://www.twitter.com"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 py-6">
          <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
            <Image
              src="/images/applepay.png" // Ensure this path is correct
              alt="Apple Pay"
              width={120}
              height={60}
            />
            <Image
              src="/images/visa.png" // Ensure this path is correct
              alt="Visa"
              width={120}
              height={60}
            />
          </div>
          <div className="text-center flex flex-wrap justify-center items-center gap-6 mb-4">
            <Image
              src={government} // Ensure this path is correct
              alt="UAE Government"
              width={120}
              height={60}
            />
            <Image
              src={trda} // Ensure this path is correct
              alt="TDRA"
              width={120}
              height={60}
            />
          </div>
          <Link
            href="/"
            className="flex items-center justify-center m-4"
            style={{ direction: "rtl" }}
          >
            للأطلاع علي التراخيص القانونيه
          </Link>

          <div className="text-center">
            <p className="text-gray-900 text-sm mb-2 font-semibold">
              الرقم الضريبي : 10906797
            </p>
            <p className="text-gray-900 text-sm">© 2016 AliiexpressUAE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
