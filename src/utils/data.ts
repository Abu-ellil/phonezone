// Utility to load the store data
import storeData from "../../public/data.json";

interface Product {
  url: string;
  route: string;
  id: string;
  name: string;
  original_price?: string;
  price?: string;
  image_url: string;
  category: string;
  subcategory?: string;
}

interface Category {
  name: string;
  url: string;
  route: string;
  subcategories: {
    name: string;
    products: Product[];
  }[];
}

type RawStoreData = {
  [category: string]: {
    [subcategory: string]: Product[];
  };
};

export function getProducts(): Product[] {
  const rawData = storeData as RawStoreData;
  const allProducts: Product[] = [];

  Object.entries(rawData).forEach(([category, subcategories]) => {
    Object.entries(subcategories).forEach(([subcategory, products]) => {
      products.forEach((product) => {
        allProducts.push({
          ...product,
          category,
          subcategory,
        });
      });
    });
  });

  return allProducts;
}

export function getCategories(): Category[] {
  const rawData = storeData as RawStoreData;

  return Object.entries(rawData).map(([categoryName, subcategories]) => ({
    name: categoryName,
    url: `/category/${encodeURIComponent(categoryName)}`,
    route: `/category/${encodeURIComponent(categoryName)}`,
    subcategories: Object.entries(subcategories).map(([name, products]) => ({
      name,
      products,
    })),
  }));
}

export function getFeaturedProducts(limit: number = 8): Product[] {
  const products = getProducts();
  return products.slice(0, limit);
}

/**
 * Get the newest products (simulated by returning products in reverse order)
 * @param limit Maximum number of products to return
 * @returns Array of newest products
 */
export function getNewestProducts(limit: number = 8): Product[] {
  const products = getProducts();
  // In a real application, products would be sorted by date
  // Here we're simulating newest products by reversing the array
  return [...products].reverse().slice(0, limit);
}

export function getProductsByCategory(categoryName: string): Product[] {
  const products = getProducts();
  return products.filter((product) => product.category === categoryName);
}

export function getProductsBySubcategory(
  categoryName: string,
  subcategoryName: string
): Product[] {
  const products = getProducts();
  return products.filter(
    (product) =>
      product.category === categoryName &&
      product.subcategory === subcategoryName
  );
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((product) => product.id === id) || null;
}
