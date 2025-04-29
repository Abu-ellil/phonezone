import { fetchLocalJson } from "./nextFetch";

interface AppSettings {
  installmentDefaults: {
    downPaymentPercentage: number;
    monthlyInstallments: number;
    interestRate: number;
  };
  // Add other settings as needed
}

/**
 * Get app settings from local JSON file
 */
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const data = await fetchLocalJson<any>("/data/db.json");

    // Check if settings exist in the data
    if (data.settings) {
      return data.settings;
    }

    // Return default settings if not found in the data
    return {
      installmentDefaults: {
        downPaymentPercentage: 20,
        monthlyInstallments: 12,
        interestRate: 10,
      },
    };
  } catch (error) {
    console.error("❌ Error fetching app settings:", error);

    // Return default settings in case of error
    return {
      installmentDefaults: {
        downPaymentPercentage: 20,
        monthlyInstallments: 12,
        interestRate: 10,
      },
    };
  }
}

/**
 * Update installment defaults (this is a mock function since we're using local JSON)
 * In a real application, you would need to implement a backend API to update the JSON file
 */
export async function updateInstallmentDefaults(
  downPaymentPercentage: number,
  monthlyInstallments: number,
  interestRate: number
): Promise<boolean> {
  try {
    // In a real application, you would make an API call to update the settings
    // For now, we'll just log the values and return success
    console.log("Would update installment defaults to:", {
      downPaymentPercentage,
      monthlyInstallments,
      interestRate,
    });

    // Store in localStorage as a temporary solution
    localStorage.setItem(
      "installmentDefaults",
      JSON.stringify({
        downPaymentPercentage,
        monthlyInstallments,
        interestRate,
      })
    );

    return true;
  } catch (error) {
    console.error("❌ Error updating installment defaults:", error);
    return false;
  }
}
