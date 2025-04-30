// استيراد البيانات من ملفات البيانات
import { getAllProducts } from "@/contexts/data";

/**
 * استخراج التصنيفات من بيانات المنتجات
 * @returns {Promise<Array>} مصفوفة من التصنيفات
 */
export const fetchCategories = async () => {
  try {
    // الحصول على جميع المنتجات
    const products = getAllProducts();

    // إنشاء كائن لتجميع التصنيفات والتصنيفات الفرعية
    const categoriesMap = {};

    // استخراج التصنيفات والتصنيفات الفرعية من المنتجات
    products.forEach((product) => {
      if (product.category) {
        // التعامل مع التصنيف كمصفوفة أو كسلسلة نصية
        const categories = Array.isArray(product.category)
          ? product.category
          : [product.category];

        categories.forEach((category) => {
          if (!categoriesMap[category]) {
            categoriesMap[category] = {
              name: category,
              subcategories: [],
            };
          }

          // إضافة التصنيف الفرعي إذا كان موجوداً
          if (
            product.subcategory &&
            !categoriesMap[category].subcategories.some(
              (sub) => sub.name === product.subcategory
            )
          ) {
            categoriesMap[category].subcategories.push({
              name: product.subcategory,
            });
          }
        });
      }
    });

    // إضافة التصنيفات الإضافية بالترتيب المطلوب
    const additionalCategories = [
      {
        name: "هواتف ابل",
        englishName: "iPhone",
        subcategories: [
          { name: "iPhone 16 Pro Max", englishName: "iPhone 16 Pro Max" },
          { name: "iPhone 16 Pro", englishName: "iPhone 16 Pro" },
          { name: "iPhone 16", englishName: "iPhone 16" },
          { name: "iPhone 15", englishName: "iPhone 15" },
        ],
      },
      {
        name: "هواتف سامسونج",
        englishName: "Samsung",
        subcategories: [
          { name: "Samsung S25", englishName: "Samsung S25" },
          { name: "Samsung S24", englishName: "Samsung S24" },
          { name: "Samsung S23", englishName: "Samsung S23" },
        ],
      },
      {
        name: "ساعات ابل",
        englishName: "Apple Watch",
        subcategories: [
          { name: "Apple Watch Series 9", englishName: "Apple Watch Series 9" },
          { name: "Apple Watch Ultra", englishName: "Apple Watch Ultra" },
        ],
      },
      {
        name: "اجهزة سوني",
        englishName: "PlayStation",
        subcategories: [
          { name: "PlayStation 5", englishName: "PlayStation 5" },
          { name: "ألعاب PlayStation", englishName: "PlayStation Games" },
        ],
      },
      {
        name: "اكس بوكس",
        englishName: "Xbox",
        subcategories: [
          { name: "Xbox Series X", englishName: "Xbox Series X" },
          { name: "ألعاب Xbox", englishName: "Xbox Games" },
        ],
      },
      {
        name: "اكسسوارات",
        englishName: "Accessories",
        subcategories: [
          { name: "كيابل وشواحن", englishName: "Cables & Chargers" },
          { name: "سماعات", englishName: "Headphones" },
          { name: "حافظات واغطية", englishName: "Cases & Covers" },
        ],
      },
    ];

    // دمج التصنيفات الإضافية مع التصنيفات المستخرجة
    additionalCategories.forEach((category) => {
      if (!categoriesMap[category.name]) {
        categoriesMap[category.name] = category;
      } else {
        // دمج التصنيفات الفرعية
        category.subcategories.forEach((subcategory) => {
          if (
            !categoriesMap[category.name].subcategories.some(
              (sub) => sub.name === subcategory.name
            )
          ) {
            categoriesMap[category.name].subcategories.push(subcategory);
          }
        });
      }
    });

    // تحويل الكائن إلى مصفوفة
    return Object.values(categoriesMap);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * الحصول على التصنيفات الرئيسية
 * @returns {Promise<Array>} مصفوفة من أسماء التصنيفات
 */
export const fetchMainCategories = async () => {
  const categories = await fetchCategories();
  return categories.map((category) => category.name);
};

/**
 * الحصول على التصنيفات الفرعية لتصنيف معين
 * @param {string} categoryName اسم التصنيف
 * @returns {Promise<Array>} مصفوفة من التصنيفات الفرعية
 */
export const fetchSubcategories = async (categoryName) => {
  const categories = await fetchCategories();
  const category = categories.find((cat) => cat.name === categoryName);
  return category ? category.subcategories : [];
};
