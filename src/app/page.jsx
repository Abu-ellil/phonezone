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
    newestProducts,
    bestSellingProducts,
    iPhone16ProMaxProducts,
    samsungS25Products,
    iPhone16ProProducts,
    iPhone16Products,
    samsungS24Products,
    iPhone15Products,
    playstationProducts,
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

  return (
    <div className="min-h-screen flex flex-col transition-theme">
      <Header />
      <main className="flex-1 space-y-6 animate-fade-in">
        <HeroBanner />

        <div className="container mx-auto px-4 space-y-6">
          <BannerImage src={img1} alt="Banner 1" />

          <Section
            title="iPhone 16 Pro Max"
            products={iPhone16ProMaxProducts}
            link="/category/iPhone"
          />

          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="Samsung S25"
            products={samsungS25Products}
            link="/category/Samsung"
          />

          <Section
            title="iPhone 16 Pro"
            products={iPhone16ProProducts}
            link="/category/iPhone"
          />

          <Section
            title="iPhone 16"
            products={iPhone16Products}
            link="/category/iPhone"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="Samsung S24"
            products={samsungS24Products}
            link="/category/Samsung"
          />

          <Section
            title="iPhone 15"
            products={iPhone15Products}
            link="/category/iPhone"
          />

          <Section
            title="PlayStation"
            products={playstationProducts}
            link="/category/PlayStation"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="ساعات ابل"
            products={products
              .filter((p) => p?.category?.includes("ساعات ابل"))
              .slice(0, 8)}
            link="/category/ساعات أبل"
          />

          <Section
            title="اكسسوارات"
            products={products
              .filter((p) => p?.category?.includes("اكسسوارات"))
              .slice(0, 8)}
            link="/category/اكسسوارات"
          />

          <Section
            title="لابتوبات وشاشات"
            products={products
              .filter((p) => p?.category?.includes("لابتوبات وشاشات"))
              .slice(0, 8)}
            link="/category/لابتوبات وشاشات"
          />

          <Section
            title="الاجهزة اللوحية ايبادات"
            products={products
              .filter((p) => p?.category?.includes("الاجهزة اللوحية ايبادات"))
              .slice(0, 8)}
            link="/category/الاجهزة اللوحية ايبادات"
          />
          <Section
            title="أجهزة صوت و سماعات"
            products={products
              .filter((p) => p?.category?.includes("أجهزة صوت و سماعات"))
              .slice(0, 8)}
            link="/category/أجهزة صوت و سماعات"
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
  if (!products || products.length === 0) {
    return null;
  }

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
