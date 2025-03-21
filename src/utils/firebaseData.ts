// Utility to load data from Firebase
import {
  getFirebaseProducts,
  getFirebaseFeaturedProducts,
  getFirebaseNewestProducts,
  getFirebaseProductsByCategory,
  getFirebaseProductsBySubcategory,
  getFirebaseProductById,
} from "@/firebase/services";

// Fallback to local data if Firebase fetch fails
import {
  getProducts as getLocalProducts,
  getFeaturedProducts as getLocalFeaturedProducts,
  getNewestProducts as getLocalNewestProducts,
  getProductsByCategory as getLocalProductsByCategory,
  getProductsBySubcategory as getLocalProductsBySubcategory,
  getProductById as getLocalProductById,
} from "./data";

/**
 * Get all products from Firebase
 * @returns Promise resolving to array of products
 */
export async function getProductsFromFirebase() {
  try {
    const products = await getFirebaseProducts();
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
    const products = await getFirebaseFeaturedProducts(limit);
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
    const products = await getFirebaseNewestProducts(limit);
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
    const products = await getFirebaseProductsByCategory(categoryName);
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
 * Get products by subcategory from Firebase
 * @param categoryName Category name
 * @param subcategoryName Subcategory name
 * @returns Promise resolving to array of products in the subcategory
 */
export async function getProductsBySubcategoryFromFirebase(
  categoryName: string,
  subcategoryName: string
) {
  try {
    const products = await getFirebaseProductsBySubcategory(
      categoryName,
      subcategoryName
    );
    return products.length > 0
      ? products
      : getLocalProductsBySubcategory(categoryName, subcategoryName);
  } catch (error) {
    console.error(
      `Error fetching products for subcategory ${subcategoryName} from Firebase:`,
      error
    );
    return getLocalProductsBySubcategory(categoryName, subcategoryName);
  }
}

/**
 * Get product by ID from Firebase
 * @param id Product ID
 * @returns Promise resolving to product object or null if not found
 */
export async function getProductByIdFromFirebase(id: string) {
  try {
    const product = await getFirebaseProductById(id);
    return product || getLocalProductById(id);
  } catch (error) {
    console.error(`Error fetching product ${id} from Firebase:`, error);
    return getLocalProductById(id);
  }
}
