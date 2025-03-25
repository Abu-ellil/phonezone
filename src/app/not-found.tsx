"use client";
import { getProducts } from "@/utils/data";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  // Get 4 random products
  const allProducts = getProducts();
  const randomProducts = allProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 14);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <Link
            href="/"
            className="component-base inline-flex items-center justify-center gap-2"
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
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-right mb-6">
            منتجات قد تعجبك
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {randomProducts.map((product) => (
              <ProductCard key={product.id.toString()} {...product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
