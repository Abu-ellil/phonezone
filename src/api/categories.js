import axios from "axios";

// الحصول على التصنيفات الرئيسية والفرعية من API
export async function fetchCategories() {
  try {
    const response = await axios.get("http://localhost:9000/products");

    // تخزين التصنيفات الرئيسية والفرعية
    const mainCategories = [];
    const categoryMap = new Map();

    // استخراج البيانات من الاستجابة
    if (typeof response.data === "object") {
      // استخراج التصنيفات الأساسية مباشرة من الكائن الرئيسي
      const rootCategories = Object.keys(response.data);

      // إضافة التصنيفات الأساسية
      rootCategories.forEach((categoryName) => {
        if (!categoryMap.has(categoryName)) {
          const category = {
            name: categoryName,
            subcategories: [],
          };
          categoryMap.set(categoryName, category);
          mainCategories.push(category);
        }
      });

      // تحويل الكائن إلى مصفوفة من المنتجات للحصول على التصنيفات الفرعية
      let allProducts = [];

      // البحث عن المنتجات في المستوى الأول
      for (const key in response.data) {
        if (Array.isArray(response.data[key])) {
          allProducts = allProducts.concat(response.data[key]);
        } else if (typeof response.data[key] === "object") {
          // إضافة التصنيفات الفرعية من المستوى الثاني
          const subCategories = Object.keys(response.data[key]);
          const parentCategory = categoryMap.get(key);

          if (parentCategory) {
            subCategories.forEach((subCategoryName) => {
              if (
                !parentCategory.subcategories.some(
                  (sub) => sub.name === subCategoryName
                )
              ) {
                parentCategory.subcategories.push({ name: subCategoryName });
              }
            });
          }

          // البحث في المستوى الثاني
          for (const subKey in response.data[key]) {
            if (Array.isArray(response.data[key][subKey])) {
              allProducts = allProducts.concat(response.data[key][subKey]);
            } else if (
              typeof response.data[key][subKey] === "object" &&
              response.data[key][subKey] !== null
            ) {
              // البحث في المستوى الثالث
              for (const subSubKey in response.data[key][subKey]) {
                if (Array.isArray(response.data[key][subKey][subSubKey])) {
                  allProducts = allProducts.concat(
                    response.data[key][subKey][subSubKey]
                  );
                }
              }
            }
          }
        }
      }

      // استخراج التصنيفات الإضافية من المنتجات
      allProducts.forEach((product) => {
        if (!product.category) return;

        // التعامل مع الفئات كمصفوفة أو كنص
        const categories = Array.isArray(product.category)
          ? product.category
          : [product.category];

        categories.forEach((categoryName) => {
          if (!categoryName) return;
          const name = categoryName.toString();

          if (!categoryMap.has(name)) {
            const category = {
              name,
              subcategories: [],
            };
            categoryMap.set(name, category);
            mainCategories.push(category);
          }

          // إضافة الفئة الفرعية إذا كانت موجودة
          if (product.subcategory) {
            const subcategoryName = product.subcategory.toString();
            const category = categoryMap.get(name);

            // التحقق من عدم وجود الفئة الفرعية مسبقًا
            if (
              !category.subcategories.some(
                (sub) => sub.name === subcategoryName
              )
            ) {
              category.subcategories.push({ name: subcategoryName });
            }
          }
        });
      });
    }

    // ترتيب التصنيفات حسب الاسم
    mainCategories.sort((a, b) => a.name.localeCompare(b.name));

    // ترتيب التصنيفات الفرعية حسب الاسم
    mainCategories.forEach((category) => {
      category.subcategories.sort((a, b) => a.name.localeCompare(b.name));
    });

    return mainCategories;
  } catch (error) {
    console.error("حدث خطأ أثناء جلب التصنيفات:", error);
    return [];
  }
}

// الحصول على التصنيفات الرئيسية فقط
export async function fetchMainCategories() {
  const categories = await fetchCategories();
  return categories.map((category) => ({
    name: category.name,
    hasSubcategories: category.subcategories.length > 0,
  }));
}

// الحصول على التصنيفات الفرعية لتصنيف معين
export async function fetchSubcategories(categoryName) {
  const categories = await fetchCategories();
  const category = categories.find((cat) => cat.name === categoryName);
  return category ? category.subcategories : [];
}
