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

// مزود السياق
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  // التصنيفات المطلوبة
  const [iPhone16ProMaxProducts, setIPhone16ProMaxProducts] = useState([]);
  const [samsungS25Products, setSamsungS25Products] = useState([]);
  const [iPhone16ProProducts, setIPhone16ProProducts] = useState([]);
  const [iPhone16Products, setIPhone16Products] = useState([]);
  const [samsungS24Products, setSamsungS24Products] = useState([]);
  const [iPhone15Products, setIPhone15Products] = useState([]);
  const [playstationProducts, setPlaystationProducts] = useState([]);
  const [xboxProducts, setXboxProducts] = useState([]);
  const [appleWatchesProducts, setAppleWatchesProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = () => {
      try {
        setLoading(true);

        // استخدام البيانات من ملفات البيانات
        console.log("استخدام البيانات من ملفات البيانات");

        // تعيين المنتجات مباشرة
        setIPhone16ProMaxProducts(iPhoneData.iPhone16ProMax);
        setSamsungS25Products(samsungData.samsungS25);
        setIPhone16ProProducts(iPhoneData.iPhone16Pro);
        setIPhone16Products(iPhoneData.iPhone16);
        setSamsungS24Products(samsungData.samsungS24);
        setIPhone15Products(iPhoneData.iPhone15);
        setPlaystationProducts(playstationData.playstation);

        // تعيين منتجات Xbox وساعات أبل أيضاً
        setXboxProducts(xboxData.xbox);

        // تعيين ساعات أبل
        if (Array.isArray(appleWatches)) {
          setAppleWatchesProducts(appleWatches);
        } else if (
          appleWatches.appleWatches &&
          Array.isArray(appleWatches.appleWatches)
        ) {
          setAppleWatchesProducts(appleWatches.appleWatches);
        }

        // جمع جميع المنتجات في مصفوفة واحدة
        const allProducts = getAllProducts();

        // تعيين المنتجات المميزة والأحدث والأكثر مبيعاً
        setFeaturedProducts(allProducts.slice(0, 8));
        setNewestProducts(allProducts.slice(0, 8));
        setBestSellingProducts(allProducts.slice(0, 8));

        // تعيين جميع المنتجات
        setProducts(allProducts);

        console.log("تم تحميل", allProducts.length, "منتج");
        setLoading(false);
      } catch (err) {
        console.error("خطأ في تحميل البيانات:", err);
        setError(err.message || "حدث خطأ أثناء تحميل البيانات");
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // دالة للحصول على منتج بواسطة المعرف
  const getProductById = (id) => {
    // تحويل المعرف إلى رقم إذا كان سلسلة نصية
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    console.log("Looking for product with ID:", numericId);

    // أولاً، البحث في مصفوفة المنتجات المحملة (إذا كانت موجودة)
    if (products.length > 0) {
      console.log("Searching in loaded products array");
      const product = products.find((product) => {
        const productId =
          typeof product.id === "string"
            ? parseInt(product.id, 10)
            : product.id;
        return productId === numericId;
      });

      if (product) {
        console.log("Found product in loaded products:", product);
        return product;
      }
    }

    // إذا لم يتم العثور على المنتج في المصفوفة المحملة، البحث مباشرة في ملفات البيانات
    console.log("Searching directly in data files");

    // البحث في بيانات iPhone
    for (const category in iPhoneData) {
      const product = iPhoneData[category].find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in iPhone data:", product);
        return product;
      }
    }

    // البحث في بيانات Samsung
    for (const category in samsungData) {
      const product = samsungData[category].find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in Samsung data:", product);
        return product;
      }
    }

    // البحث في بيانات PlayStation
    for (const category in playstationData) {
      const product = playstationData[category].find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in PlayStation data:", product);
        return product;
      }
    }

    // البحث في بيانات الملحقات
    for (const category in accessoriesData) {
      const product = accessoriesData[category].find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in accessories data:", product);
        return product;
      }
    }

    // البحث في بيانات Xbox
    if (xboxData && xboxData.xbox) {
      const product = xboxData.xbox.find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in Xbox data:", product);
        return product;
      }
    }

    // البحث في بيانات ساعات أبل
    if (Array.isArray(appleWatches)) {
      const product = appleWatches.find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in Apple Watches data:", product);
        return product;
      }
    } else if (
      appleWatches.appleWatches &&
      Array.isArray(appleWatches.appleWatches)
    ) {
      const product = appleWatches.appleWatches.find((p) => {
        const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productId === numericId;
      });
      if (product) {
        console.log("Found product in Apple Watches data:", product);
        return product;
      }
    }

    // إذا لم يتم العثور على المنتج في أي من ملفات البيانات
    console.log("Product not found");
    return null;
  };

  // دالة للبحث عن المنتجات
  const searchProducts = (query) => {
    if (!query || query.trim() === "") return [];

    const searchQuery = query.toLowerCase();
    return products.filter((product) => {
      // البحث في اسم المنتج
      if (product.name && product.name.toLowerCase().includes(searchQuery)) {
        return true;
      }

      // البحث في التصنيف
      if (
        product.category &&
        product.category.toLowerCase().includes(searchQuery)
      ) {
        return true;
      }

      // البحث في التصنيف الفرعي
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
    iPhone16ProMaxProducts,
    samsungS25Products,
    iPhone16ProProducts,
    iPhone16Products,
    samsungS24Products,
    iPhone15Products,
    playstationProducts,
    xboxProducts,
    appleWatchesProducts,
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
