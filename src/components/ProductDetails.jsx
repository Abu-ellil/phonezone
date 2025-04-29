"use client";
import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { Loading } from "@/components/Loading";

export default function ProductDetails({ productId }) {
  const { getProductById, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("me"); // me = Middle East, us = US Version
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      const productData = getProductById(productId);
      setProduct(productData);
      if (productData?.variants?.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    }
  }, [productId, getProductById]);

  if (loading) {
    return <Loading size="large" text="جاري تحميل المنتج..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-xl">حدث خطأ أثناء تحميل المنتج: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لم يتم العثور على المنتج</p>
      </div>
    );
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
      version: selectedVersion,
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* صورة المنتج */}
        <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* تفاصيل المنتج */}
        <div className="space-y-4 text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="flex items-center justify-end gap-4 mt-2">
            <span className="text-2xl font-bold text-primary">
              {selectedVariant ? selectedVariant.price : product.price} د.إ
            </span>
            {product.original_price && (
              <span className="text-lg text-gray-500 line-through">
                {product.original_price} د.إ
              </span>
            )}
          </div>

          {/* الخيارات */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                اختر الحجم:
              </h3>
              <div className="flex flex-wrap gap-3 justify-end">
                {product.variants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedVariant?.size === variant.size
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* اختيار النسخة */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              اختر النسخة:
            </h3>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setSelectedVersion("me")}
                className={`px-4 py-2 border rounded-md ${
                  selectedVersion === "me"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                نسخة الشرق الأوسط
              </button>
              <button
                onClick={() => setSelectedVersion("us")}
                className={`px-4 py-2 border rounded-md ${
                  selectedVersion === "us"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                نسخة أمريكية
              </button>
            </div>
          </div>

          {/* وصف المنتج */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              وصف المنتج:
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || "لا يوجد وصف متاح لهذا المنتج."}
            </p>
          </div>

          {/* زر الإضافة إلى السلة */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              className="w-full component-base py-3 px-8 text-lg font-medium hover:opacity-90 transition-colors"
              disabled={isAddedToCart}
            >
              {isAddedToCart ? "تمت الإضافة إلى السلة" : "إضافة إلى السلة"}
            </button>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">الضمان:</span>{" "}
              {product.warranty || "سنة واحدة"}
            </div>
            <div>
              <span className="font-medium">حالة المخزون:</span>{" "}
              {product.stock_status === "in_stock"
                ? "متوفر"
                : "غير متوفر حالياً"}
            </div>
            <div>
              <span className="font-medium">الفئة:</span>{" "}
              {Array.isArray(product.category)
                ? product.category.join(", ")
                : product.category}
            </div>
            {product.subcategory && (
              <div>
                <span className="font-medium">الفئة الفرعية:</span>{" "}
                {product.subcategory}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
