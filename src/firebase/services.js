import { db } from "./config";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

/**
 * Get all products from Firestore
 * @returns {Promise<Array>} Array of products
 */
export const getFirebaseProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: doc.data().category || "",
      subcategory: doc.data().subcategory || "",
    }));
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

/**
 * Get featured products from Firestore
 * @param {number} limitCount - Maximum number of products to return
 * @returns {Promise<Array>} Array of featured products
 */
export const getFirebaseFeaturedProducts = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, "products");
    const featuredQuery = query(
      productsRef,
      where("featured", "==", true),
      limit(limitCount)
    );

    const snapshot = await getDocs(featuredQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: doc.data().category || "",
      subcategory: doc.data().subcategory || "",
    }));
  } catch (error) {
    console.error("Error getting featured products:", error);
    return [];
  }
};

/**
 * Get newest products from Firestore
 * @param {number} limitCount - Maximum number of products to return
 * @returns {Promise<Array>} Array of newest products
 */
export const getFirebaseNewestProducts = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, "products");
    const newestQuery = query(
      productsRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(newestQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: doc.data().category || "",
      subcategory: doc.data().subcategory || "",
    }));
  } catch (error) {
    console.error("Error getting newest products:", error);
    return [];
  }
};

/**
 * Get products by category from Firestore
 * @param {string} categoryName - Category name
 * @returns {Promise<Array>} Array of products in the category
 */
export const getFirebaseProductsByCategory = async (categoryName) => {
  try {
    const productsRef = collection(db, "products");
    const categoryQuery = query(
      productsRef,
      where("category", "==", categoryName)
    );

    const snapshot = await getDocs(categoryQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: doc.data().category || "",
      subcategory: doc.data().subcategory || "",
    }));
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
};

/**
 * Get products by subcategory from Firestore
 * @param {string} categoryName - Category name
 * @param {string} subcategoryName - Subcategory name
 * @returns {Promise<Array>} Array of products in the subcategory
 */
export const getFirebaseProductsBySubcategory = async (
  categoryName,
  subcategoryName
) => {
  try {
    const productsRef = collection(db, "products");
    const subcategoryQuery = query(
      productsRef,
      where("category", "==", categoryName),
      where("subcategory", "==", subcategoryName)
    );

    const snapshot = await getDocs(subcategoryQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: doc.data().category || "",
      subcategory: doc.data().subcategory || "",
    }));
  } catch (error) {
    console.error("Error getting products by subcategory:", error);
    return [];
  }
};

/**
 * Get product by ID from Firestore
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export const getFirebaseProductById = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data(),
        category: productSnap.data().category || "",
        subcategory: productSnap.data().subcategory || "",
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
};
