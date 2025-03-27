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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Get all products from Firestore
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      let createdAt;
      try {
        createdAt =
          data.createdAt?.toDate?.() instanceof Date
            ? data.createdAt.toDate().toISOString()
            : data.createdAt instanceof Date
            ? data.createdAt.toISOString()
            : new Date().toISOString();
      } catch {
        createdAt = new Date().toISOString();
      }
      return {
        id: doc.id,
        ...data,
        category: data.category || "",
        subcategory: data.subcategory || "",
        createdAt,
      };
    });
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
export const getFeaturedProducts = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, "products");
    const featuredQuery = query(
      productsRef,
      where("featured", "==", true),
      limit(limitCount)
    );

    const snapshot = await getDocs(featuredQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
      return {
        id: doc.id,
        ...data,
        category: data.category || "",
        subcategory: data.subcategory || "",
        createdAt,
      };
    });
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
export const getNewestProducts = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, "products");
    const newestQuery = query(
      productsRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(newestQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
      return {
        id: doc.id,
        ...data,
        category: data.category || "",
        subcategory: data.subcategory || "",
        createdAt,
      };
    });
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
export const getProductsByCategory = async (categoryName) => {
  try {
    const productsRef = collection(db, "products");
    const categoryQuery = query(
      productsRef,
      where("category", "==", categoryName)
    );

    const snapshot = await getDocs(categoryQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
      return {
        id: doc.id,
        ...data,
        category: data.category || "",
        subcategory: data.subcategory || "",
        createdAt,
      };
    });
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
export const getProductsBySubcategory = async (
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

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
      return {
        id: doc.id,
        ...data,
        category: data.category || "",
        subcategory: data.subcategory || "",
        createdAt,
      };
    });
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
export const getProductById = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const data = productSnap.data();
      return {
        id: productSnap.id,
        ...data,
        category: data.category || "",
        subcategory: data.subcategory || "",
        createdAt: data.createdAt
          ? data.createdAt?.toDate().toISOString()
          : new Date().toISOString(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
};

/**
 * Add a new product to Firestore
 * @param {Object} productData - Product data
 * @returns {Promise<string|null>} New product ID or null if failed
 */
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, "products");
    const newProduct = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(productsRef, newProduct);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};

/**
 * Update an existing product in Firestore
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<boolean>} Success status
 */
export const updateProduct = async (id, productData) => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};

/**
 * Delete a product from Firestore
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

/**
 * Search products by name or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching products
 */
export const searchProducts = async (searchTerm) => {
  try {
    // Firebase doesn't support full-text search natively
    // This is a simple implementation that fetches all products and filters client-side
    // For production, consider using Algolia or similar search service
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    const searchTermLower = searchTerm.toLowerCase();

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        category: doc.data().category || "",
        subcategory: doc.data().subcategory || "",
        createdAt: doc.data().createdAt
          ? doc.data().createdAt?.toDate().toISOString()
          : new Date().toISOString(),
      }))
      .filter((product) => {
        const nameMatch =
          product.name && product.name.toLowerCase().includes(searchTermLower);
        const descriptionMatch =
          product.description &&
          product.description.toLowerCase().includes(searchTermLower);
        return nameMatch || descriptionMatch;
      });
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
