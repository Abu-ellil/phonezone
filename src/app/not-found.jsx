"use client";
import { getProducts } from "@/utils/data";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  // Get 8 random products
  const allProducts = getProducts();
  const randomProducts = allProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col mb-8">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-10">
        <div className="text-center mb-12 bg-white p-12 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-9xl font-bold text-primary mb-6 animate-pulse">
            404
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <p className="text-gray-500 mb-8">
            يمكنك العودة إلى الصفحة الرئيسية أو تصفح منتجاتنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="component-base inline-flex items-center justify-center gap-2 text-lg px-8 py-4 w-full sm:w-auto hover:scale-105 transition-transform"
            >
              <span>العودة إلى الصفحة الرئيسية</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="/category/الهواتف"
              className="component-base inline-flex items-center justify-center gap-2 text-lg px-8 py-4 w-full sm:w-auto hover:scale-105 transition-transform"
            >
              <span>تصفح الهواتف</span>
            </Link>
          </div>
        </div>

        <div className="mb-8 bg-white p-12 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-primary text-right mb-8">
            منتجات مقترحة لك
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 hover:gap-8 transition-all duration-300">
            {randomProducts.map((product) => (
              <ProductCard
                key={product.id.toString()}
                {...product}
                id={product.id.toString()}
                price={product.price?.toString()}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
