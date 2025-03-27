// Utility to load data from Firebase
import {
  getProducts,
  getFeaturedProducts,
  getNewestProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
} from "@/firebase/productsService";

// Fallback to local data if Firebase fetch fails
import {
  getProducts as getLocalProducts,
  getFeaturedProducts as getLocalFeaturedProducts,
  getNewestProducts as getLocalNewestProducts,
  getProductsByCategory as getLocalProductsByCategory,
  getProductById as getLocalProductById,
} from "./data";

/**
 * Get all products from Firebase
 * @returns Promise resolving to array of products
 */
export async function getProductsFromFirebase() {
  try {
    const products = await getProducts();
    return products.length > 0 ? products : getLocalProducts();
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    return getLocalProducts();
  }
}

/**
 * Get featured products from Firebase
 * @param limit Maximum number of products to return
 * @returns Promise resolving to array of featured products
 */
export async function getFeaturedProductsFromFirebase(limit = 8) {
  try {
    const products = await getFeaturedProducts(limit);
    return products.length > 0 ? products : getLocalFeaturedProducts(limit);
  } catch (error) {
    console.error("Error fetching featured products from Firebase:", error);
    return getLocalFeaturedProducts(limit);
  }
}

/**
 * Get newest products from Firebase
 * @param limit Maximum number of products to return
 * @returns Promise resolving to array of newest products
 */
export async function getNewestProductsFromFirebase(limit = 8) {
  try {
    const products = await getNewestProducts(limit);
    return products.length > 0 ? products : getLocalNewestProducts(limit);
  } catch (error) {
    console.error("Error fetching newest products from Firebase:", error);
    return getLocalNewestProducts(limit);
  }
}

/**
 * Get products by category from Firebase
 * @param categoryName Category name
 * @returns Promise resolving to array of products in the category
 */
export async function getProductsByCategoryFromFirebase(categoryName: string) {
  try {
    const products = await getProductsByCategory(categoryName);
    return products.length > 0
      ? products
      : getLocalProductsByCategory(categoryName);
  } catch (error) {
    console.error(
      `Error fetching products for category ${categoryName} from Firebase:`,
      error
    );
    return getLocalProductsByCategory(categoryName);
  }
}

/**
 * Get product by ID from Firebase
 * @param id Product ID
 * @returns Promise resolving to product object or null if not found
 */
export async function getProductByIdFromFirebase(id: string) {
  try {
    const product = await getProductById(id);
    return product || getLocalProductById(parseInt(id));
  } catch (error) {
    console.error(`Error fetching product ${id} from Firebase:`, error);
    return getLocalProductById(parseInt(id));
  }
}

/**
 * Search products by name or description from Firebase
 * @param searchTerm Search term
 * @returns Promise resolving to array of matching products
 */
export async function searchProductsFromFirebase(searchTerm: string) {
  try {
    const products = await searchProducts(searchTerm);
    return products.length > 0 ? products : [];
  } catch (error) {
    console.error(
      `Error searching products with term "${searchTerm}" from Firebase:`,
      error
    );
    return [];
  }
}
