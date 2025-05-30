"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/contexts/ProductsContext";
import { Loading } from "@/components/Loading";

export default function NotFound() {
  const [randomProducts, setRandomProducts] = useState([]);
  const { products, loading, error } = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      const shuffledProducts = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
      setRandomProducts(shuffledProducts);
    }
  }, [products]);

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
    <div className="min-h-screen flex flex-col mb-8">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-10">
        <div className="text-center mb-12 bg-white p-12 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-9xl font-bold text-red-600 mb-6 animate-pulse">
            404
          </h1>
          <p className="text-2xl text-gray-800 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <p className="text-gray-700 mb-8">
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
          <h2 className="text-3xl font-bold text-red-600 text-right mb-8">
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
