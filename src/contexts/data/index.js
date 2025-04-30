// تجميع كل البيانات من الملفات الفرعية
import iPhoneData from "./iphone";
import samsungData from "./samsung";
import playstationData from "./playstation";
import accessoriesData from "./accessories";
import xboxData from "./xbox";
import appleWatches from "./appleWatches";

// تجميع كل البيانات في كائن واحد
const allData = {
  // بيانات iPhone
  iPhone16ProMax: iPhoneData.iPhone16ProMax,
  iPhone16Pro: iPhoneData.iPhone16Pro,
  iPhone16: iPhoneData.iPhone16,
  iPhone15: iPhoneData.iPhone15,

  // بيانات Samsung
  samsungS25: samsungData.samsungS25,
  samsungS24: samsungData.samsungS24,
  samsungS23: samsungData.samsungS23,

  // بيانات PlayStation
  playstation: playstationData.playstation,
  playstationGames: playstationData.playstationGames,

  // بيانات Xbox
  xbox: xboxData.xbox,

  // بيانات ساعات أبل
  appleWatches: appleWatches,

  // بيانات الملحقات
  batteries: accessoriesData.batteries,
  gamingAccessories: accessoriesData.gamingAccessories,
  phoneAccessories: accessoriesData.phoneAccessories,
};

// دالة للحصول على جميع المنتجات في مصفوفة واحدة
export const getAllProducts = () => {
  const allProducts = [];

  // إضافة منتجات iPhone
  allProducts.push(...iPhoneData.iPhone16ProMax);
  allProducts.push(...iPhoneData.iPhone16Pro);
  allProducts.push(...iPhoneData.iPhone16);
  allProducts.push(...iPhoneData.iPhone15);

  // إضافة منتجات Samsung
  allProducts.push(...samsungData.samsungS25);
  allProducts.push(...samsungData.samsungS24);
  allProducts.push(...samsungData.samsungS23);

  // إضافة منتجات PlayStation
  allProducts.push(...playstationData.playstation);
  allProducts.push(...playstationData.playstationGames);

  // إضافة منتجات Xbox
  allProducts.push(...xboxData.xbox);

  // إضافة ساعات أبل
  if (Array.isArray(appleWatches)) {
    allProducts.push(...appleWatches);
  } else if (
    appleWatches.appleWatches &&
    Array.isArray(appleWatches.appleWatches)
  ) {
    allProducts.push(...appleWatches.appleWatches);
  }

  // إضافة الملحقات
  allProducts.push(...accessoriesData.batteries);
  allProducts.push(...accessoriesData.gamingAccessories);
  allProducts.push(...accessoriesData.phoneAccessories);

  return allProducts;
};

// دالة للحصول على المنتجات حسب التصنيف
export const getProductsByCategory = (category) => {
  const allProducts = getAllProducts();
  return allProducts.filter((product) => {
    // التحقق من نوع التصنيف
    if (Array.isArray(product.category)) {
      // إذا كان التصنيف مصفوفة
      return product.category.includes(category);
    } else {
      // إذا كان التصنيف سلسلة نصية
      return product.category === category;
    }
  });
};

// دالة للحصول على المنتجات حسب التصنيف الفرعي
export const getProductsBySubcategory = (subcategory) => {
  const allProducts = getAllProducts();
  return allProducts.filter((product) => {
    // التحقق من وجود تصنيف فرعي
    if (product.subcategory) {
      return product.subcategory === subcategory;
    }
    return false;
  });
};

// دالة للبحث عن المنتجات
export const searchProducts = (query) => {
  if (!query || query.trim() === "") return [];

  const allProducts = getAllProducts();
  const searchQuery = query.toLowerCase();

  return allProducts.filter((product) => {
    // البحث في اسم المنتج
    if (product.name && product.name.toLowerCase().includes(searchQuery)) {
      return true;
    }

    // البحث في التصنيف
    if (product.category) {
      // إذا كان التصنيف مصفوفة
      if (Array.isArray(product.category)) {
        for (const cat of product.category) {
          if (cat.toLowerCase().includes(searchQuery)) {
            return true;
          }
        }
      }
      // إذا كان التصنيف سلسلة نصية
      else if (
        typeof product.category === "string" &&
        product.category.toLowerCase().includes(searchQuery)
      ) {
        return true;
      }
    }

    // البحث في التصنيف الفرعي
    if (
      product.subcategory &&
      typeof product.subcategory === "string" &&
      product.subcategory.toLowerCase().includes(searchQuery)
    ) {
      return true;
    }

    return false;
  });
};

export default allData;
