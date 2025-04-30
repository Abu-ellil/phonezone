"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CarouselWrapper from "@/components/CarouselWrapper";
import Image from "next/image";
import img1 from "../../public/images/00 (1).jpg";
import img2 from "../../public/images/00 (2).jpg";
import img3 from "../../public/images/00 (3).jpg";
import img4 from "../../public/images/00 (4).jpg";
import HeroBanner from "@/components/HeroBanner";
import Testimonials from "@/components/Testimonials";
import { useProducts } from "@/contexts/ProductsContext";
import { Loading } from "@/components/Loading";

export default function Home() {
  const {
    products,
    featuredProducts,
    newestProducts,
    bestSellingProducts,
    loading,
    error,
  } = useProducts();

  if (loading) {
    return <Loading size="large" text="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl">
          حدث خطأ أثناء تحميل المنتجات: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // الحصول على المنتجات من فئة معينة
  const getProductsByCategory = (categoryName, limit = 8) => {
    if (!products || products.length === 0) return [];

    // تحويل اسم الفئة إلى مصفوفة إذا كان نصًا
    const searchTerms = Array.isArray(categoryName)
      ? categoryName.map((term) => term.toLowerCase().trim())
      : [categoryName.toLowerCase().trim()];

    // البحث في المنتجات
    const filteredProducts = products.filter((product) => {
      if (!product) return false;

      // البحث في اسم المنتج
      if (product.name) {
        const productName = product.name.toString().toLowerCase();
        if (searchTerms.some((term) => productName.includes(term))) {
          return true;
        }
      }

      // البحث في خاصية category
      if (product.category) {
        // إذا كانت الفئة مصفوفة
        if (Array.isArray(product.category)) {
          const categories = product.category.map((cat) =>
            cat ? cat.toString().toLowerCase() : ""
          );

          // التحقق من وجود أي من مصطلحات البحث في الفئات
          for (const category of categories) {
            if (searchTerms.some((term) => category.includes(term))) {
              return true;
            }
          }
        }
        // إذا كانت الفئة نصًا
        else {
          const category = product.category.toString().toLowerCase();
          if (searchTerms.some((term) => category.includes(term))) {
            return true;
          }
        }
      }

      // البحث في خاصية subcategory
      if (product.subcategory) {
        // إذا كانت الفئة الفرعية مصفوفة
        if (Array.isArray(product.subcategory)) {
          const subcategories = product.subcategory.map((subcat) =>
            subcat ? subcat.toString().toLowerCase() : ""
          );

          // التحقق من وجود أي من مصطلحات البحث في الفئات الفرعية
          for (const subcategory of subcategories) {
            if (searchTerms.some((term) => subcategory.includes(term))) {
              return true;
            }
          }
        }
        // إذا كانت الفئة الفرعية نصًا
        else {
          const subcategory = product.subcategory.toString().toLowerCase();
          if (searchTerms.some((term) => subcategory.includes(term))) {
            return true;
          }
        }
      }

      // البحث في الوصف
      if (product.description) {
        const description = product.description.toString().toLowerCase();
        if (searchTerms.some((term) => description.includes(term))) {
          return true;
        }
      }

      return false;
    });

    // إرجاع عدد محدد من المنتجات
    return filteredProducts.slice(0, limit);
  };

  return (
    <div className="min-h-screen flex flex-col transition-theme">
      <Header />
      <main className="flex-1 space-y-6 animate-fade-in">
        <HeroBanner />

        <div className="container mx-auto px-4 space-y-6">
          <BannerImage src={img1} alt="Banner 1" />

          <Section
            title="هواتف آيفون"
            products={getProductsByCategory([
              "ايفون",
              "iphone",
              "apple",
              "ابل",
              "آبل",
            ])}
            link="/category/ابل"
          />

          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="هواتف سامسونج"
            products={getProductsByCategory(["سامسونج", "samsung", "galaxy"])}
            link="/category/سامسونج"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="ساعات آبل"
            products={getProductsByCategory([
              "ساعات",
              "watch",
              "apple watch",
              "ساعة ابل",
            ])}
            link="/category/ساعات ابل"
          />

          <Section
            title="بلايستيشن"
            products={getProductsByCategory([
              "بلايستيشن",
              "playstation",
              "ps5",
              "ps4",
              "بلاي ستيشن",
            ])}
            link="/category/بلاي ستيشن"
          />

          <Section
            title="ألعاب الفيديو"
            products={getProductsByCategory([
              "ألعاب",
              "games",
              "video games",
              "gaming",
            ])}
            link="/category/ألعاب الفيديو"
          />

          <Section
            title="سماعات وأجهزة صوت"
            products={getProductsByCategory("سماعات")}
            link="/category/سماعات"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="لابتوبات وشاشات"
            products={getProductsByCategory("لابتوب")}
            link="/category/لابتوبات وشاشات"
          />

          <Section
            title="الأجهزة اللوحية وايبادات"
            products={getProductsByCategory("ايباد")}
            link="/category/الاجهزة اللوحية ايبادات"
          />

          <Section
            title="بطاريات متنقلة وكيابل"
            products={getProductsByCategory("بطاريات")}
            link="/category/بطاريات متنقلة وكيابل"
          />

          <Section
            title="ماوسات وكيبوردات ألعاب"
            products={getProductsByCategory("ماوسات")}
            link="/category/ماوسات وكيبوردات ألعاب"
          />

          <Section
            title="تلفزيونات"
            products={getProductsByCategory("تلفزيون")}
            link="/category/تلفزيون"
          />

          <Section
            title="أحدث المنتجات"
            products={newestProducts}
            link="/category/احدث المنتجات"
          />

          <Section
            title="الأفضل مبيعاً"
            products={bestSellingProducts}
            link="/category/الافضل مبيعا"
          />
          <Testimonials />
        </div>
      </main>

      <FloatingWhatsAppButton />
      <Footer />
    </div>
  );
}

const BannerImage = ({ src, alt }) => (
  <div className="w-full overflow-hidden rounded-xl shadow-medium hover:shadow-large transition-all duration-300">
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={400}
      className="w-full h-auto object-cover"
      placeholder="blur"
    />
  </div>
);

const Section = ({ title, products, link }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className=" p-4">
      <CarouselWrapper title={title}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </CarouselWrapper>

      <div className="flex items-center mt-4 space-x-2 rtl:space-x-reverse">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <Link
          href={link}
          className=" text-primary-500 dark:text-primary-300 border border-primary-500 dark:border-primary-300 px-4 py-2 hover:opacity-90 transition-colors"
        >
          عرض الكل
        </Link>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      </div>
    </div>
  );
};
