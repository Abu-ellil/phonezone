"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// إنشاء السياق
const ProductsContext = createContext();

// مزود السياق
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات من السيرفر
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:9000/products");
        const responseData = response.data;
        console.log("البيانات المستلمة من السيرفر:", responseData);

        // التحقق من شكل البيانات
        let productsArray = [];

        // إذا كانت البيانات مصفوفة
        if (Array.isArray(responseData)) {
          productsArray = responseData;
        }
        // إذا كانت البيانات كائن يحتوي على خاصية products
        else if (
          responseData &&
          typeof responseData === "object" &&
          Array.isArray(responseData.products)
        ) {
          productsArray = responseData.products;
        }
        // إذا كانت البيانات كائن يحتوي على هيكل متعدد المستويات
        else if (responseData && typeof responseData === "object") {
          // البحث عن المنتجات في جميع المستويات
          for (const level1Key in responseData) {
            if (Array.isArray(responseData[level1Key])) {
              // المستوى الأول هو مصفوفة
              productsArray = productsArray.concat(responseData[level1Key]);
            } else if (
              typeof responseData[level1Key] === "object" &&
              responseData[level1Key] !== null
            ) {
              // المستوى الثاني
              for (const level2Key in responseData[level1Key]) {
                if (Array.isArray(responseData[level1Key][level2Key])) {
                  // المستوى الثاني هو مصفوفة
                  productsArray = productsArray.concat(
                    responseData[level1Key][level2Key]
                  );
                } else if (
                  typeof responseData[level1Key][level2Key] === "object" &&
                  responseData[level1Key][level2Key] !== null
                ) {
                  // المستوى الثالث
                  for (const level3Key in responseData[level1Key][level2Key]) {
                    if (
                      Array.isArray(
                        responseData[level1Key][level2Key][level3Key]
                      )
                    ) {
                      // المستوى الثالث هو مصفوفة
                      productsArray = productsArray.concat(
                        responseData[level1Key][level2Key][level3Key]
                      );
                    }
                  }
                }
              }
            }
          }
          console.log(`تم العثور على ${productsArray.length} منتج`);
        }

        // إذا لم نجد أي مصفوفة، نستخدم مصفوفة فارغة
        if (productsArray.length === 0) {
          console.warn(
            "لم يتم العثور على بيانات منتجات صالحة. استخدام مصفوفة فارغة."
          );
        }

        // تخزين جميع المنتجات
        setProducts(productsArray);

        // تصفية المنتجات المميزة
        const featured = productsArray
          .filter((product) => product && product.featured === true)
          .slice(0, 8);
        setFeaturedProducts(featured);

        // تصفية أحدث المنتجات (باستخدام تاريخ الإضافة أو ترتيبها عشوائيًا)
        const newest = [...productsArray]
          .sort((a, b) => {
            if (!a || !b) return 0;
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date();
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date();
            return dateB - dateA;
          })
          .slice(0, 8);
        setNewestProducts(newest);

        // تصفية المنتجات الأكثر مبيعًا
        const bestSelling = productsArray
          .filter((product) => product && product.bestSelling === true)
          .slice(0, 8);
        setBestSellingProducts(bestSelling);

        setLoading(false);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
        setError(err.message || "حدث خطأ أثناء جلب البيانات");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // دالة للحصول على منتج بواسطة المعرف
  const getProductById = (id) => {
    if (!id) return null;

    // تحويل المعرف إلى نص
    const idStr = id.toString();

    // البحث عن المنتج
    return products.find((product) => {
      if (!product || !product.id) return false;
      return product.id.toString() === idStr;
    });
  };

  // دالة للحصول على منتجات حسب الفئة
  const getProductsByCategory = (category) => {
    if (!category) return [];

    const categoryLower = category.toLowerCase().trim();

    return products.filter((product) => {
      if (!product) return false;

      // إذا كانت الفئة مصفوفة
      if (Array.isArray(product.category)) {
        return product.category.some((cat) => {
          if (!cat) return false;
          return cat.toString().toLowerCase().includes(categoryLower);
        });
      }

      // إذا كانت الفئة نص
      if (product.category) {
        return product.category
          .toString()
          .toLowerCase()
          .includes(categoryLower);
      }

      return false;
    });
  };

  // القيمة التي سيتم توفيرها للمكونات
  const value = {
    products,
    featuredProducts,
    newestProducts,
    bestSellingProducts,
    loading,
    error,
    getProductById,
    getProductsByCategory,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

// هوك مخصص لاستخدام سياق المنتجات
export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useProducts داخل ProductsProvider");
  }
  return context;
}
