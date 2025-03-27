"use client";
import { getProductById } from "@/utils/data";
import { Loading } from "@/components/Loading";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProductPage({ params }) {
  // Unwrap the params object using React.use()
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("me"); // me = Middle East, us = US Version

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const { addToCart } = useCart();

  if (loading) {
    return <Loading size="large" text="جاري تحميل المنتج..." />;
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      price: selectedVariant ? selectedVariant.price : product.price || "",
      original_price: product.original_price,
      category: product.category,
      subcategory: product.subcategory,
      variant: selectedVariant ? selectedVariant.size : null,
    });

    setIsAddedToCart(true);
    toast.success(
      <div className="flex flex-col items-center text-right">
        <div className="flex items-center mb-2">
          <span className="font-medium">تمت إضافة المنتج إلى السلة بنجاح</span>
        </div>
        <div className="flex gap-3 mt-2 w-full justify-center">
          <Link
            href="/cart"
            className="component-base py-2 px-4 text-sm font-medium hover:opacity-90 transition-colors"
          >
            السلة
          </Link>
        </div>
      </div>
    );
  };

  console.log(product);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mx-auto px-4 py-8  bg-gray-50">
        <div className="flex flex-col md:flex-row gap-8 max-w-[1200px] mx-auto">
          <div className="w-full">
            <div className=" w-full  rounded-lg shadow-md overflow-hidden">
              <div className="md:flex p-6">
                <div className="md:w-2/5 flex justify-center items-center">
                  <div className="relative h-96 w-full">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                      className="p-4"
                      priority
                    />
                  </div>
                </div>
                <div className="md:w-3/5 p-6 text-right">
                  <div className="mb-2">
                    {product.category && (
                      <span className="text-sm text-blue-600 font-medium">
                        {product.category}
                      </span>
                    )}
                    {product.subcategory && (
                      <span className="text-sm text-blue-600 font-medium mr-2">
                        / {product.subcategory}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {product.name}
                  </h1>

                  <div className="mb-8 border-b pb-6">
                    {product.variants && product.variants.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">
                          اختر مساحة التخزين:
                        </label>
                        <div className="flex gap-3 justify-start">
                          {product.variants.map((variant) => (
                            <button
                              key={variant.size}
                              onClick={() => setSelectedVariant(variant)}
                              className={`px-4 py-2 rounded-lg ${
                                selectedVariant?.size === variant.size
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              } hover:opacity-90 transition-colors`}
                            >
                              {variant.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">
                          اختر النسخة:
                        </label>
                        <div className="flex gap-3 justify-start">
                          <button
                            onClick={() => setSelectedVersion("me")}
                            className={`px-3 py-1.5 rounded-lg text-xs ${
                              selectedVersion === "me"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            } hover:opacity-90 transition-colors`}
                          >
                            نسخة الشرق الأوسط
                          </button>
                          <button
                            onClick={() => setSelectedVersion("us")}
                            className={`px-3 py-1.5 rounded-lg text-xs ${
                              selectedVersion === "us"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            } hover:opacity-90 transition-colors`}
                          >
                            النسخة الامريكية
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-start items-center gap-3 mb-2">
                      {product.original_price &&
                        (product.price || selectedVariant?.price) !==
                          product.original_price && (
                          <span className="text-lg text-gray-500 line-through">
                            {Number(product.original_price).toFixed(2)} د.إ
                          </span>
                        )}
                      <span className="text-3xl font-bold text-primary">
                        {Number(
                          selectedVariant?.price || product.price
                        ).toFixed(2)}{" "}
                        د.إ
                      </span>
                    </div>
                    {product.original_price &&
                      (selectedVariant?.price || product.price) !==
                        product.original_price && (
                        <div className="flex justify-start">
                          <span className="component-base text-green-800 text-xs font-medium px-2.5 py-0.5">
                            خصم
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-start items-center gap-2">
                      <span className="text-gray-700">متوفر</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>

                    <div className="flex justify-start items-center gap-2">
                      <span className="text-gray-700">شحن سريع</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-8">
                    {!isAddedToCart ? (
                      <button
                        onClick={handleAddToCart}
                        className="w-full component-base primary py-3 px-6 font-medium text-lg"
                      >
                        إضافة إلى سلة التسوق
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <Link
                          href="/"
                          className="flex-1 component-base primary py-2 px-4 font-medium text-sm text-center"
                        >
                          متابعة التسوق
                        </Link>
                        <Link
                          href="/cart"
                          className="flex-1 component-base py-2 px-4 text-black font-xs hover:opacity-90 transition-colors text-lg text-center bg-blue-400"
                        >
                          السلة
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">
                  وصف المنتج
                </h2>
                <p className="text-gray-700 text-right leading-relaxed">
                  {product.name} - {product.subcategory || product.category}
                </p>
                {product.subcategory &&
                  product.subcategory.includes("ايفون") && (
                    <div className="mt-4 space-y-2 text-right">
                      <p className="text-gray-700">• شاشة عالية الدقة</p>
                      <p className="text-gray-700">• كاميرا متطورة</p>
                      <p className="text-gray-700">• بطارية تدوم طويلاً</p>
                      <p className="text-gray-700">• معالج سريع</p>
                    </div>
                  )}
              </div>

              {/* Product Features */}
              <div className="p-6 border-t border-gray-200 flex justify-center items-center">
                <div className="space-y-4">
                  {/* Free Delivery */}
                  <div className="flex  items-center gap-3 py-3 border-b">
                    <div className="component-base p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-700">
                        الطلب والتوصيل خلال 24 ساعة
                      </p>
                    </div>
                  </div>

                  {/* Warranty */}
                  <div className="flex  items-center gap-3 py-3 border-b">
                    <div className="component-base p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>{" "}
                    <div className="text-right">
                      <p className="text-gray-700">ضمان لمدة عامين</p>
                    </div>
                  </div>

                  {/* Installment */}
                  <div className="flex  items-center gap-3 py-3 border-b">
                    <div className="component-base p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>{" "}
                    <div className="text-right">
                      <p className="text-gray-700">
                        احصل عليه بأقساط شهرية تبدأ من 420 او 1000 د.إ والباقي
                        أقساط
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Policy */}
              <div className="p-6 border-t border-gray-200">
                <div className="text-right mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    حسب سياسة المتجر📋
                  </h3>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-gray-700">الشروط الواجب توفرها للتقديم</p>
                  <p className="text-gray-700">ان تكون مواطن او مقيم</p>
                  <p className="text-gray-700">يتوفر لديك حساب بنكي</p>
                  <p className="text-gray-700">
                    عند استلامك للجهاز يتم توقيعك على عقد الالتزام بالأقساط
                    الشهرية مع مندوب التوصيل
                  </p>
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  {!isAddedToCart ? (
                    <button
                      onClick={handleAddToCart}
                      className="component-base  py-3 px-6 font-medium hover:opacity-90 transition-colors text-lg"
                    >
                      إضافة للسلة
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <Link
                        href="/"
                        className="component-base  py-3 px-6 font-medium hover:opacity-90 transition-colors text-lg text-center"
                      >
                        متابعة التسوق
                      </Link>
                      <Link
                        href="/cart"
                        className="component-base  py-2 px-4 font-medium hover:opacity-90 transition-colors text-lg text-center"
                      >
                        {product.original_price}
                      </Link>
                    </div>
                  )}
                  <div className="text-right"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
