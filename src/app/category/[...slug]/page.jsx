"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { useProducts } from "@/contexts/ProductsContext";
import { Loading } from "@/components/Loading";

export default function CategoryPage({ params }) {
  const { products, loading, error } = useProducts();

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

  if (!params?.slug || params.slug.length === 0) {
    notFound();
  }

  const categoryName = decodeURIComponent(params.slug[0]);
  const subcategoryName =
    params.slug.length > 1 ? decodeURIComponent(params.slug[1]) : null;

  // تصفية المنتجات حسب الفئة والفئة الفرعية
  let filteredProducts = products.filter((product) => {
    // التحقق من وجود خاصية category
    if (!product.category) return false;

    // تحويل الفئة إلى مصفوفة إذا لم تكن كذلك
    const categories = Array.isArray(product.category)
      ? product.category.map((c) => c.toLowerCase())
      : [product.category.toString().toLowerCase()];

    // تحويل اسم المنتج إلى نص صغير للمقارنة
    const productName = product.name?.toLowerCase() || "";

    // البحث في الفئات واسم المنتج
    const categoryNameLower = categoryName.toLowerCase();
    const matchesCategory =
      categories.some((cat) => cat.includes(categoryNameLower)) ||
      productName.includes(categoryNameLower);

    // إذا كان هناك فئة فرعية، تحقق منها أيضًا
    if (subcategoryName) {
      const subcategoryNameLower = subcategoryName.toLowerCase();
      const productSubcategory = product.subcategory?.toLowerCase() || "";

      return (
        matchesCategory &&
        (productName.includes(subcategoryNameLower) ||
          productSubcategory.includes(subcategoryNameLower))
      );
    }

    return matchesCategory;
  });

  // تطبيق الفلاتر من عنوان URL إذا وجدت
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  if (minPrice && minPrice !== "null") {
    filteredProducts = filteredProducts.filter(
      (product) => parseFloat(product.price || 0) >= parseFloat(minPrice)
    );
  }

  if (maxPrice && maxPrice !== "null") {
    filteredProducts = filteredProducts.filter(
      (product) => parseFloat(product.price || 0) <= parseFloat(maxPrice)
    );
  }

  if (!filteredProducts.length) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row justify-center">
          <div className="md:w-3/4">
            <div className="mb-6 text-right">
              <h1 className="text-2xl font-bold text-gray-900">
                {subcategoryName || categoryName}
              </h1>
              {subcategoryName && (
                <p className="text-sm text-gray-500">{categoryName}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-56 transition-all duration-300 hover:gap-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image_url={product.image_url}
                  price={product.price}
                  original_price={product.original_price}
                  category={product.category}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
