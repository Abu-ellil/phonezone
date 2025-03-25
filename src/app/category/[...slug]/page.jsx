"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { notFound, useParams } from "next/navigation";
import storeData from "../../../../public/data.json";

function getProductsByCategory(categoryName, params) {

  

  let products = storeData.filter((product) => {
    const productCategories = Array.isArray(product.category)
      ? product.category
      : [product.category];
    const productNameLower =
      typeof product.name === "string" ? product.name.toLowerCase() : "";

    if (categoryName === "ساعات ابل" || categoryName === "ساعات آبل") {
      const watchTerms = [
        "ساعات ابل",
        "ساعة ابل",
        "apple watch",
        "ساعة آبل",
        "ساعات آبل",
        "ابل ووتش",
        "watch",
      ];
      return watchTerms.some(
        (term) =>
          productNameLower.includes(term.toLowerCase()) ||
          productCategories.some((cat) =>
            cat.toLowerCase().includes(term.toLowerCase())
          )
      );
    }

    if (categoryName === "ابل" || categoryName === "آبل") {
      const iPhoneTerms = ["ايفون", "آيفون", "iphone", "أيفون"];
      return (
        productCategories.includes("ابل") ||
        productCategories.includes("الهواتف الذكية") ||
        iPhoneTerms.some((term) =>
          productNameLower.includes(term.toLowerCase())
        )
      );
    }

    if (categoryName === "سامسونج") {
      return (
        productCategories.includes("سامسونج") ||
        productNameLower.includes("سامسونج") ||
        productNameLower.includes("samsung")
      );
    }

    if (categoryName === "الهواتف الذكية") {
      return productCategories.includes("الهواتف الذكية");
    }

    return productCategories.includes(categoryName);
  });

  if (params) {
    if (params.minPrice && params.minPrice !== "null") {
      products = products.filter(
        (product) => (product.base_price || 0) >= Number(params.minPrice)
      );
    }
    if (params.maxPrice && params.maxPrice !== "null") {
      products = products.filter(
        (product) => (product.base_price || 0) <= Number(params.maxPrice)
      );
    }
    if (params.warranty && params.warranty !== "null") {
      products = products.filter(
        (product) => product.warranty === params.warranty
      );
    }
    if (params.stock_status && params.stock_status !== "null") {
      products = products.filter(
        (product) => product.stock_status === params.stock_status
      );
    }
  }

  return products.map((product) => ({
    ...product,
    price: product.base_price,
    original_price: product.base_price,
  }));
}

function getProductsBySubcategory(categoryName, subcategoryName, params) {
  const products = getProductsByCategory(categoryName, params);
  return products.filter((product) => {
    const productNameLower = product.name.toLowerCase();
    const subcategoryLower = subcategoryName.toLowerCase();

    if (categoryName === "سامسونج") {
      const searchTerms =
        subcategoryName === "S25 Ultra"
          ? [
              "s25 الترا",
              "s25 ultra",
              "S25 Ultra",
              "S25 الترا",
              "اس 25 الترا",
              "S25الترا",
              "s25 الترا",
            ]
          : subcategoryName === "S24 Ultra"
          ? ["s24 الترا", "s24 ultra", "S24 Ultra", "S24 الترا", "اس 24 الترا"]
          : [subcategoryName];
      return searchTerms.some((term) =>
        productNameLower.includes(term.toLowerCase())
      );
    }

    return (
      product.name.toLowerCase().includes(subcategoryLower) ||
      (product.subcategory &&
        product.subcategory.toLowerCase().includes(subcategoryLower))
    );
  });
}

export default function CategoryPage({ params }) {
  const paramss = useParams(); // Get the URL parameters
  
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

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const filterParams = {
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    warranty: searchParams.get("warranty"),
    stock_status: searchParams.get("stock_status"),
  };

  let products = getProductsByCategory(categoryName, filterParams);

  if (subcategoryName) {
    products = getProductsBySubcategory(
      categoryName,
      subcategoryName,
      filterParams
    );
  }

  if (!products.length) {
    notFound();
  }

console.log("Category Name:", categoryName); // Log the category name
console.log("Store Data:", storeData); // Log the store data

const daa = storeData.filter((product) => {
  return product.name.includes(categoryName);
});

console.log("Filtered Products:", daa); // Log the filtered products

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
