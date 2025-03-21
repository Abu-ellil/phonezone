"use client";
import { getProductsByCategory, getProductsBySubcategory } from "@/utils/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }) {
  if (!params?.slug || params.slug.length === 0) {
    notFound();
  }

  const encodedCategory = params.slug[0];
  const encodedSubcategory =
    params.slug.length > 1 ? params.slug[1] : undefined;

  if (!encodedCategory) {
    notFound();
  }

  const categoryName = decodeURIComponent(encodedCategory);
  const subcategoryName = encodedSubcategory
    ? decodeURIComponent(encodedSubcategory)
    : undefined;

  let products = getProductsByCategory(categoryName);

  if (subcategoryName) {
    let subcategoryProducts = getProductsBySubcategory(
      categoryName,
      subcategoryName
    );

    if (!subcategoryProducts.length) {
      const allCategoryProducts = getProductsByCategory(categoryName);
      subcategoryProducts = allCategoryProducts.filter(
        (product) =>
          product.subcategory && product.subcategory.includes(subcategoryName)
      );
    }

    products = subcategoryProducts;
  }

  if (!products.length) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mx-auto px-4 py-8">
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
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد منتجات في هذه الفئة</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
