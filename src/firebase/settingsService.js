import { db } from "./config";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/**
 * Get app settings from Firestore
 * @returns {Promise<Object>} App settings object
 */
export const getAppSettings = async () => {
  try {
    const settingsRef = doc(db, "settings", "appSettings");
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return settingsSnap.data();
    } else {
      // If settings don't exist, create default settings
      const defaultSettings = {
        installmentDefaults: {
          months: 3,
          downPayment: 1000,
        },
        createdAt: new Date().toISOString(),
      };

      await setDoc(settingsRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error("Error getting app settings:", error);
    // Return default settings if there's an error
    return {
      installmentDefaults: {
        months: 3,
        downPayment: 1000,
      },
    };
  }
};

/**
 * Update installment defaults in Firestore
 * @param {Object} installmentDefaults - Object containing months and downPayment values
 * @returns {Promise<boolean>} Success status
 */
export const updateInstallmentDefaults = async (installmentDefaults) => {
  try {
    const settingsRef = doc(db, "settings", "appSettings");
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      // Update existing settings
      await updateDoc(settingsRef, {
        installmentDefaults,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new settings document
      await setDoc(settingsRef, {
        installmentDefaults,
        createdAt: new Date().toISOString(),
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating installment defaults:", error);
    return false;
  }
};
