"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
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
  const [searchQuery, setSearchQuery] = useState("");
  const {
    products,
    iPhone17ProMaxProducts,
    samsungS26Products,
    iPhone17ProProducts,
    iPhone16ProMaxProducts,
    samsungS25Products,
    appleWatchesProducts,
    playstationProducts,
    loading,
    error,
    searchProducts,
  } = useProducts();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchProducts(searchQuery);
  }, [searchQuery, searchProducts]);

  const isSearching = searchQuery.trim().length > 0;

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
      <main className="flex-1 space-y-8 animate-fade-in">
        <div className="container mx-auto px-4 pt-4">
          <div className="relative max-w-3xl mx-auto group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن هاتف، ساعة، أو إكسسوارات..."
              className="w-full px-6 py-4 pr-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-medium hover:shadow-large focus:ring-2 focus:ring-primary outline-none transition-all duration-300 text-right text-lg text-gray-900 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <svg
                className="w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <HeroBanner />

        {isSearching ? (
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-right">
              نتائج البحث ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 text-lg py-12">
                لا توجد نتائج لـ &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        ) : (
        <div className="container mx-auto px-4 space-y-6">
          <BannerImage src={img1} alt="Banner 1" />

          <Section
            title="iPhone 17 Pro Max"
            products={iPhone17ProMaxProducts}
            link="/category/هواتف ابل"
          />

          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="Samsung S26 Ultra"
            products={samsungS26Products}
            link="/category/هواتف سامسونج"
          />

          <Section
            title="iPhone 17 Pro"
            products={iPhone17ProProducts}
            link="/category/هواتف ابل"
          />

          <Section
            title="iPhone 16 Pro Max"
            products={iPhone16ProMaxProducts}
            link="/category/هواتف ابل"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="Samsung S25 Ultra"
            products={samsungS25Products}
            link="/category/هواتف سامسونج"
          />

          <Section
            title="ساعات ابل"
            products={appleWatchesProducts}
            link="/category/ساعات ابل"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="PlayStation"
            products={playstationProducts}
            link="/category/اجهزة سوني"
          />

          <Testimonials />
        </div>
        )}
      </main>

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
