"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { notFound, useParams } from "next/navigation";
import storeData from "../../../../public/data.json";

function getProductsByCategory(categoryName, params) {
  const normalizedCategoryName = categoryName.toLowerCase().trim();

  let products = storeData.filter((product) => {
    const productCategories = Array.isArray(product.category)
      ? product.category.map((cat) => cat.toLowerCase().trim())
      : [product.category?.toLowerCase().trim()];
    const productNameLower =
      typeof product.name === "string" ? product.name.toLowerCase().trim() : "";

    // Handle Apple Watch category with variations
    if (
      normalizedCategoryName.includes("ساعات ابل") ||
      normalizedCategoryName.includes("ساعات آبل")
    ) {
      const watchTerms = [
        "ساعات ابل",
        "ساعة ابل",
        "apple watch",
        "ساعة آبل",
        "ساعات آبل",
        "ابل ووتش",
        "watch",
      ].map((term) => term.toLowerCase().trim());
      return watchTerms.some(
        (term) =>
          productNameLower.includes(term) ||
          productCategories.some((cat) => cat.includes(term))
      );
    }

    // Handle Apple category with variations
    if (
      normalizedCategoryName.includes("ابل") ||
      normalizedCategoryName.includes("آبل")
    ) {
      const iPhoneTerms = [
        "ايفون",
        "آيفون",
        "iphone",
        "أيفون",
        "ابل",
        "آبل",
        "apple",
        "15",
        "14",
        "13",
        "برو",
        "بروماكس",
        "pro",
        "promax",
        "max",
        "ماكس",
        "plus",
        "بلس",
      ].map((term) => term.toLowerCase().trim());
      const productNameNormalized = productNameLower
        .replace("برو", "pro")
        .replace("بروماكس", "promax")
        .replace("ماكس", "max")
        .replace("بلس", "plus");
      return (
        iPhoneTerms.some((term) => productNameNormalized.includes(term)) ||
        productCategories.some(
          (cat) =>
            cat.includes("ابل") ||
            cat.includes("آبل") ||
            cat.includes("الهواتف الذكية")
        )
      );
    }

    // Handle Samsung category with variations
    if (normalizedCategoryName.includes("سامسونج")) {
      const samsungTerms = ["سامسونج", "samsung"].map((term) =>
        term.toLowerCase().trim()
      );
      return (
        samsungTerms.some((term) => productNameLower.includes(term)) ||
        productCategories.some((cat) =>
          samsungTerms.some((term) => cat.includes(term))
        )
      );
    }

    // Handle Smartphones category
    if (normalizedCategoryName.includes("الهواتف الذكية")) {
      return productCategories.some((cat) => cat.includes("الهواتف الذكية"));
    }

    // Default category matching with fuzzy search
    return (
      productCategories.some((cat) => cat.includes(normalizedCategoryName)) ||
      productNameLower.includes(normalizedCategoryName)
    );
  });

  // Apply filters if provided
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

  return products.length > 0
    ? products.map((product) => ({
        ...product,
        price: product.base_price,
        original_price: product.base_price,
      }))
    : [];
}

function getProductsBySubcategory(categoryName, subcategoryName, params) {
  const products = getProductsByCategory(categoryName, params);
  const normalizedSubcategory = subcategoryName
    .toLowerCase()
    .trim()
    .replace("برو", "pro")
    .replace("بروماكس", "promax")
    .replace("ماكس", "max")
    .replace("بلس", "plus");

  return products.filter((product) => {
    const productNameLower = product.name.toLowerCase().trim();
    const productSubcategory = product.subcategory?.toLowerCase().trim() || "";

    if (categoryName === "ابل" || categoryName === "آبل") {
      const iPhoneTerms = ["ايفون", "آيفون", "iphone", "أيفون"];
      const hasIPhoneInName = iPhoneTerms.some((term) =>
        productNameLower.includes(term.toLowerCase())
      );
      const modelTerms = normalizedSubcategory.split(" ");

      const normalizedProductName = productNameLower
        .replace("برو", "pro")
        .replace("بروماكس", "promax")
        .replace("ماكس", "max")
        .replace("بلس", "plus");

      return (
        hasIPhoneInName &&
        modelTerms.every((term) => normalizedProductName.includes(term))
      );
    } else if (categoryName === "سامسونج") {
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
            ].map((term) => term.toLowerCase().trim())
          : subcategoryName === "S24 Ultra"
          ? [
              "s24 الترا",
              "s24 ultra",
              "S24 Ultra",
              "S24 الترا",
              "اس 24 الترا",
            ].map((term) => term.toLowerCase().trim())
          : [normalizedSubcategory];

      return searchTerms.some((term) => productNameLower.includes(term));
    }

    // More flexible matching for subcategories
    return (
      productNameLower.includes(normalizedSubcategory) ||
      productSubcategory.includes(normalizedSubcategory) ||
      (Array.isArray(product.category) &&
        product.category.some((cat) =>
          cat.toLowerCase().trim().includes(normalizedSubcategory)
        ))
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-56 transition-all duration-300 hover:gap-10">
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
