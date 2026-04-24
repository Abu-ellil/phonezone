"use client";
import { createContext, useContext, useState, useEffect } from "react";

// استيراد البيانات من ملفات البيانات
import { getAllProducts } from "./data";
import iPhoneData from "./data/iphone";
import samsungData from "./data/samsung";
import playstationData from "./data/playstation";
import accessoriesData from "./data/accessories";
import xboxData from "./data/xbox";
import appleWatches from "./data/appleWatches";

// إنشاء السياق
const ProductsContext = createContext();

const findProductById = (data, targetId) => {
  for (const category in data) {
    if (Array.isArray(data[category])) {
      const product = data[category].find((p) => {
        const pId = String(p.id);
        return pId === String(targetId);
      });
      if (product) return product;
    }
  }
  return null;
};

// مزود السياق
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  // التصنيفات المطلوبة
  const [iPhone17ProMaxProducts, setIPhone17ProMaxProducts] = useState([]);
  const [samsungS26Products, setSamsungS26Products] = useState([]);
  const [iPhone17ProProducts, setIPhone17ProProducts] = useState([]);
  const [iPhone16ProMaxProducts, setIPhone16ProMaxProducts] = useState([]);
  const [samsungS25Products, setSamsungS25Products] = useState([]);
  const [appleWatchesProducts, setAppleWatchesProducts] = useState([]);
  const [playstationProducts, setPlaystationProducts] = useState([]);
  const [xboxProducts, setXboxProducts] = useState([]);
  const [iPhone16ProProducts, setIPhone16ProProducts] = useState([]);
  const [iPhone16Products, setIPhone16Products] = useState([]);
  const [samsungS24Products, setSamsungS24Products] = useState([]);
  const [iPhone15Products, setIPhone15Products] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = () => {
      try {
        setLoading(true);

        setIPhone17ProMaxProducts(iPhoneData.iPhone17ProMax || []);
        setSamsungS26Products(samsungData.samsungS26 || []);
        setIPhone17ProProducts(iPhoneData.iPhone17Pro || []);
        setIPhone16ProMaxProducts(iPhoneData.iPhone16ProMax);
        setSamsungS25Products(samsungData.samsungS25);
        setIPhone16ProProducts(iPhoneData.iPhone16Pro);
        setIPhone16Products(iPhoneData.iPhone16);
        setSamsungS24Products(samsungData.samsungS24);
        setIPhone15Products(iPhoneData.iPhone15);
        setPlaystationProducts(playstationData.playstation);
        setXboxProducts(xboxData.xbox);

        if (Array.isArray(appleWatches)) {
          setAppleWatchesProducts(appleWatches);
        } else if (
          appleWatches.appleWatches &&
          Array.isArray(appleWatches.appleWatches)
        ) {
          setAppleWatchesProducts(appleWatches.appleWatches);
        }

        const allProducts = getAllProducts();

        setFeaturedProducts(allProducts.slice(0, 8));
        setNewestProducts(allProducts.slice(0, 8));
        setBestSellingProducts(allProducts.slice(0, 8));
        setProducts(allProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل البيانات");
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // دالة للحصول على منتج بواسطة المعرف
  const getProductById = (id) => {
    try {
      const targetId = String(id);

      if (products.length > 0) {
        const product = products.find((p) => String(p.id) === targetId);
        if (product) return product;
      }

      return (
        findProductById(iPhoneData, targetId) ||
        findProductById(samsungData, targetId) ||
        findProductById(playstationData, targetId) ||
        findProductById(accessoriesData, targetId) ||
        (xboxData?.xbox?.find((p) => String(p.id) === targetId) || null) ||
        (Array.isArray(appleWatches)
          ? appleWatches.find((p) => String(p.id) === targetId)
          : appleWatches?.appleWatches?.find((p) => String(p.id) === targetId)) ||
        null
      );
    } catch {
      return null;
    }
  };

  // دالة للبحث عن المنتجات
  const searchProducts = (query) => {
    if (!query || query.trim() === "") return [];

    const searchQuery = query.toLowerCase();
    return products.filter((product) => {
      if (product.name && product.name.toLowerCase().includes(searchQuery)) {
        return true;
      }
      if (
        product.category &&
        product.category.toLowerCase().includes(searchQuery)
      ) {
        return true;
      }
      if (
        product.subcategory &&
        product.subcategory.toLowerCase().includes(searchQuery)
      ) {
        return true;
      }
      return false;
    });
  };

  // دالة للحصول على المنتجات حسب التصنيف
  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category);
  };

  // دالة للحصول على المنتجات حسب التصنيف الفرعي
  const getProductsBySubcategory = (subcategory) => {
    return products.filter((product) => product.subcategory === subcategory);
  };

  // القيمة التي سيتم توفيرها للمكونات
  const contextValue = {
    products,
    featuredProducts,
    newestProducts,
    bestSellingProducts,
    iPhone17ProMaxProducts,
    samsungS26Products,
    iPhone17ProProducts,
    iPhone16ProMaxProducts,
    samsungS25Products,
    appleWatchesProducts,
    playstationProducts,
    xboxProducts,
    iPhone16ProProducts,
    iPhone16Products,
    samsungS24Products,
    iPhone15Products,
    loading,
    error,
    getProductById,
    searchProducts,
    getProductsByCategory,
    getProductsBySubcategory,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

// هوك مخصص لاستخدام سياق المنتجات
export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
