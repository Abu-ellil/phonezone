"use client";
import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { useProducts } from "@/contexts/ProductsContext";
import { Loading } from "@/components/Loading";

// استيراد ملفات البيانات مباشرة
import iPhoneData from "@/contexts/data/iphone";
import samsungData from "@/contexts/data/samsung";
import playstationData from "@/contexts/data/playstation";
import accessoriesData from "@/contexts/data/accessories";
import xboxData from "@/contexts/data/xbox";
import appleWatches from "@/contexts/data/appleWatches";

export default function CategoryPage({ params }) {
  const { slug } = use(params);
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

  if (!slug || slug.length === 0) {
    notFound();
  }

  const categoryName = decodeURIComponent(slug[0]);
  const subcategoryName =
    slug.length > 1 ? decodeURIComponent(slug[1]) : null;

  // تصفية المنتجات حسب الفئة والفئة الفرعية
  let filteredProducts = [];

  if (categoryName === "iPhone" || categoryName === "هواتف ابل") {
    if (subcategoryName) {
      if (subcategoryName === "iPhone 17 Pro Max") {
        filteredProducts = iPhoneData.iPhone17ProMax || [];
      } else if (subcategoryName === "iPhone 17 Pro") {
        filteredProducts = iPhoneData.iPhone17Pro || [];
      } else if (subcategoryName === "iPhone 16 Pro Max") {
        filteredProducts = iPhoneData.iPhone16ProMax || [];
      } else if (subcategoryName === "iPhone 16 Pro") {
        filteredProducts = iPhoneData.iPhone16Pro || [];
      } else if (subcategoryName === "iPhone 16") {
        filteredProducts = iPhoneData.iPhone16 || [];
      } else if (subcategoryName === "iPhone 15") {
        filteredProducts = iPhoneData.iPhone15 || [];
      } else {
        filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const subcategoryNameLower = subcategoryName.toLowerCase();
          return (
            productName.includes(subcategoryNameLower) ||
            (product.subcategory &&
              product.subcategory.toLowerCase().includes(subcategoryNameLower))
          );
        });
      }
    } else {
      filteredProducts = [
        ...(iPhoneData.iPhone17ProMax || []),
        ...(iPhoneData.iPhone17Pro || []),
        ...(iPhoneData.iPhone16ProMax || []),
        ...(iPhoneData.iPhone16Pro || []),
        ...(iPhoneData.iPhone16 || []),
        ...(iPhoneData.iPhone15 || []),
      ];
    }
  } else if (categoryName === "Samsung" || categoryName === "هواتف سامسونج") {
    if (subcategoryName) {
      if (subcategoryName === "Samsung S26") {
        filteredProducts = samsungData.samsungS26 || [];
      } else if (subcategoryName === "Samsung S25") {
        filteredProducts = samsungData.samsungS25 || [];
      } else if (subcategoryName === "Samsung S24") {
        filteredProducts = samsungData.samsungS24 || [];
      } else if (subcategoryName === "Samsung S23") {
        filteredProducts = samsungData.samsungS23 || [];
      } else {
        filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const subcategoryNameLower = subcategoryName.toLowerCase();
          return (
            productName.includes(subcategoryNameLower) ||
            (product.subcategory &&
              product.subcategory.toLowerCase().includes(subcategoryNameLower))
          );
        });
      }
    } else {
      filteredProducts = [
        ...(samsungData.samsungS26 || []),
        ...(samsungData.samsungS25 || []),
        ...(samsungData.samsungS24 || []),
        ...(samsungData.samsungS23 || []),
      ];
    }
  } else if (categoryName === "PlayStation" || categoryName === "اجهزة سوني") {
    if (subcategoryName) {
      if (subcategoryName === "PlayStation 5") {
        filteredProducts =
          playstationData.playstation.filter(
            (product) => product.subcategory === "بلاي ستيشن 5"
          ) || [];
      } else if (
        subcategoryName === "ألعاب PlayStation" ||
        subcategoryName === "PlayStation Games"
      ) {
        filteredProducts = playstationData.playstationGames || [];
      } else {
        filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const subcategoryNameLower = subcategoryName.toLowerCase();
          return (
            productName.includes(subcategoryNameLower) ||
            (product.subcategory &&
              product.subcategory.toLowerCase().includes(subcategoryNameLower))
          );
        });
      }
    } else {
      filteredProducts = [
        ...(playstationData.playstation || []),
        ...(playstationData.playstationGames || []),
      ];
    }
  } else if (
    categoryName === "Xbox" ||
    categoryName.includes("Xbox") ||
    categoryName === "اكس بوكس"
  ) {
    if (subcategoryName) {
      if (
        subcategoryName === "Xbox Series X" ||
        subcategoryName.includes("Series X")
      ) {
        filteredProducts = xboxData.xboxConsoles || [];
      } else if (
        subcategoryName === "ألعاب Xbox" ||
        subcategoryName === "Xbox Games"
      ) {
        filteredProducts = xboxData.xboxGames || [];
      } else {
        filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const subcategoryNameLower = subcategoryName.toLowerCase();
          return (
            productName.includes(subcategoryNameLower) ||
            (product.subcategory &&
              product.subcategory.toLowerCase().includes(subcategoryNameLower))
          );
        });
      }
    } else {
      filteredProducts = [
        ...(xboxData.xboxConsoles || []),
        ...(xboxData.xboxGames || []),
      ];
    }
  } else if (
    categoryName === "ساعات أبل" ||
    categoryName === "ساعات ابل" ||
    categoryName === "Apple Watch"
  ) {
    if (subcategoryName) {
      if (
        subcategoryName === "Apple Watch Series 9" ||
        subcategoryName.includes("Series 9")
      ) {
        filteredProducts = appleWatches.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          return (
            productName.includes("series 9") || productName.includes("watch 9")
          );
        });
      } else if (
        subcategoryName === "Apple Watch Ultra" ||
        subcategoryName.includes("Ultra")
      ) {
        filteredProducts = appleWatches.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          return (
            productName.includes("ultra") &&
            (productName.includes("watch") || productName.includes("ساع"))
          );
        });
      } else {
        filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const subcategoryNameLower = subcategoryName.toLowerCase();
          return (
            productName.includes(subcategoryNameLower) ||
            (product.subcategory &&
              product.subcategory.toLowerCase().includes(subcategoryNameLower))
          );
        });
      }
    } else {
      filteredProducts = appleWatches;
    }
  } else if (categoryName === "اكسسوارات" || categoryName === "Accessories") {
    if (subcategoryName) {
      if (
        subcategoryName === "كيابل وشواحن" ||
        subcategoryName === "Cables & Chargers"
      ) {
        filteredProducts = accessoriesData.cables || [];
      } else if (
        subcategoryName === "سماعات" ||
        subcategoryName === "Headphones"
      ) {
        filteredProducts = accessoriesData.headphones || [];
      } else if (
        subcategoryName === "حافظات واغطية" ||
        subcategoryName === "Cases & Covers"
      ) {
        filteredProducts = accessoriesData.cases || [];
      } else {
        filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const subcategoryNameLower = subcategoryName.toLowerCase();
          return (
            productName.includes(subcategoryNameLower) ||
            (product.subcategory &&
              product.subcategory.toLowerCase().includes(subcategoryNameLower))
          );
        });
      }
    } else {
      filteredProducts = [
        ...(accessoriesData.cables || []),
        ...(accessoriesData.headphones || []),
        ...(accessoriesData.cases || []),
      ];
    }
  } else {
    filteredProducts = products.filter((product) => {
      if (!product.category) return false;

      const categories = Array.isArray(product.category)
        ? product.category.map((c) => c.toLowerCase())
        : [product.category.toString().toLowerCase()];

      const productName = product.name?.toLowerCase() || "";

      const categoryNameLower = categoryName.toLowerCase();
      const matchesCategory =
        categories.some((cat) => cat.includes(categoryNameLower)) ||
        productName.includes(categoryNameLower);

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
  }

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
