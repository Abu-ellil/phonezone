import { fetchLocalJson } from "./nextFetch";

// ✅ جلب المنتجات من الملف المحلي
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchLocalJson<{ products: Product[] }>("/data/db.json");
    return data.products.map((product) => ({
      ...product,
      category: Array.isArray(product.category)
        ? product.category
        : [product.category],
      createdAt: new Date().toISOString(),
      price: product.base_price,
      original_price: product.base_price,
      variants: Array.isArray(product.variants) ? product.variants : [],
    }));
  } catch (error) {
    console.error("❌ Error fetching products from local file:", error);
    return [];
  }
}

// ✅ جلب جميع الفئات وتصنيف المنتجات تحتها
export async function getCategories(): Promise<Category[]> {
  const products = await getProducts();
  const categoriesMap = new Map<
    string,
    { products: Product[]; subcategories: Map<string, Product[]> }
  >();

  products.forEach((product) => {
    if (Array.isArray(product.category)) {
      product.category.forEach((cat) => {
        if (!categoriesMap.has(cat)) {
          categoriesMap.set(cat, { products: [], subcategories: new Map() });
        }
        const category = categoriesMap.get(cat)!;
        category.products.push(product);

        if (product.subcategory) {
          if (!category.subcategories.has(product.subcategory)) {
            category.subcategories.set(product.subcategory, []);
          }
          category.subcategories.get(product.subcategory)?.push(product);
        }
      });
    }
  });

  return Array.from(categoriesMap.entries()).map(
    ([name, { products, subcategories }]) => ({
      name,
      url: `/category/${encodeURIComponent(name)}`,
      route: `/category/${encodeURIComponent(name)}`,
      products,
      subcategories: Array.from(subcategories.entries()).map(
        ([subName, subProducts]) => ({
          name: subName,
          products: subProducts,
        })
      ),
    })
  );
}

// ✅ جلب المنتجات المميزة (أحدث 8 منتجات)
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  const products = await getProducts();
  // Since we don't have featured flag in local data, return first n products
  return products.slice(0, limit);
}

/**
 * Get the newest products (simulated by returning products in reverse order)
 * @param limit Maximum number of products to return
 * @returns Array of newest products
 */
export async function getNewestProducts(limit: number = 8): Promise<Product[]> {
  const products = await getProducts();
  return [...products].reverse().slice(0, limit);
}

// ✅ جلب المنتجات حسب الفئة
export async function getProductsByCategory(
  categoryName: string,
  params?: { [key: string]: string }
): Promise<Product[]> {
  let products = await getProducts();
  products = products.filter((product) =>
    product.category.includes(categoryName)
  );

  if (params) {
    if (params.minPrice) {
      products = products.filter(
        (product) => (product.price || 0) >= Number(params.minPrice)
      );
    }
    if (params.maxPrice) {
      products = products.filter(
        (product) => (product.price || 0) <= Number(params.maxPrice)
      );
    }
    if (params.warranty) {
      products = products.filter(
        (product) => product.warranty === params.warranty
      );
    }
    if (params.stock_status) {
      products = products.filter(
        (product) => product.stock_status === params.stock_status
      );
    }
  }

  return products;
}

// ✅ جلب المنتجات حسب الفئة الفرعية
export async function getProductsBySubcategory(
  categoryName: string,
  subcategoryName: string
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => {
    const productNameLower = product.name.toLowerCase();
    const productSubcategory = product.subcategory?.toLowerCase() || "";
    const normalizedSubcategory = subcategoryName
      .toLowerCase()
      .replace("برو", "pro")
      .replace("بروماكس", "promax")
      .replace("ماكس", "max")
      .replace("بلس", "plus");

    // دعم خاص لأجهزة iPhone
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
        product.category.includes(categoryName) &&
        hasIPhoneInName &&
        modelTerms.every((term) => normalizedProductName.includes(term))
      );
    }

    // دعم خاص لأجهزة Samsung
    if (categoryName === "سامسونج") {
      const hasSamsungInName =
        productNameLower.includes("سامسونج") ||
        productNameLower.includes("samsung");

      return (
        product.category.includes(categoryName) &&
        hasSamsungInName &&
        (productNameLower.includes(normalizedSubcategory.toLowerCase()) ||
          productSubcategory.includes(normalizedSubcategory.toLowerCase()))
      );
    }

    // الفئات الأخرى
    return (
      product.category.includes(categoryName) &&
      (product.subcategory === subcategoryName ||
        productNameLower.includes(subcategoryName.toLowerCase()))
    );
  });
}

// ✅ جلب المنتج حسب الـ ID
export async function getProductById(
  id: string | number
): Promise<Product | null> {
  try {
    const products = await getProducts();
    const product = products.find((p) => p.id === Number(id));
    return product || null;
  } catch (error) {
    console.error(`❌ Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// ✅ تعريفات البيانات (Interfaces)
interface Variant {
  type: string;
  size: string;
  price: number;
}

interface Product {
  url: string;
  id: number;
  name: string;
  warranty: string;
  stock_status: string;
  image_url: string;
  category: string[];
  base_price: number;
  variants: Variant[];
  subcategory?: string;
  featured?: boolean;
  bestSelling?: boolean;
  createdAt?: string;
  price?: number;
  original_price?: number;
}

interface Category {
  name: string;
  url: string;
  route: string;
  products: Product[];
  subcategories: { name: string; products: Product[] }[];
}
