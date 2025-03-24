// Currency conversion utility functions

// Conversion rate: 1 SAR = 0.98 AED
const SAR_TO_AED_RATE = 0.98;

/**
 * Extracts the numeric value from a price string or number
 * @param price Price value (can be string like "2788.00 د.إ" or number)
 * @returns The numeric value
 */
export function extractNumericValue(
  price: string | number | undefined
): number {
  if (!price) return 0;
  if (typeof price === "number") return price;

  // Extract numeric part from the string
  const numericMatch = price.match(/(\d+(?:\.\d+)?)/); // Updated regex to match numbers with optional decimals
  if (!numericMatch) return 0;

  // Remove commas and convert to number
  return parseFloat(numericMatch[0].replace(/,/g, ""));
}

/**
 * Converts a price from SAR to AED
 * @param sarPrice Price in SAR (can be a string like "2788.00 د.إ" or a number)
 * @returns The price in AED
 */
export function convertSARtoAED(sarPrice: string | number): number {
  const numericValue =
    typeof sarPrice === "string" ? extractNumericValue(sarPrice) : sarPrice;

  return numericValue * SAR_TO_AED_RATE;
}

/**
 * Formats a price in AED currency format
 * @param price The price value
 * @returns Formatted price string
 */
export function formatAEDPrice(price: number): string {
  return `${price.toFixed(2)} د.إ`;
}

/**
 * Formats a price in SAR currency format
 * @param price The price value
 * @returns Formatted price string
 */
export function formatSARPrice(price: number): string {
  return `${price.toFixed(2)} د.إ`;
}

/**
 * Gets AED formatted price from a SAR price string or number
 * @param sarPrice Original SAR price (can be string like "2788.00 د.إ" or number)
 * @returns Object with formatted AED price
 */
export function getDualCurrencyPrice(sarPrice: string | number | undefined): {
  aed: string;
  aedValue: number;
} {
  if (!sarPrice) {
    return {
      aed: "",
      aedValue: 0,
    };
  }

  const sarValue = extractNumericValue(sarPrice);
  const aedValue = convertSARtoAED(sarValue);

  return {
    aed: formatAEDPrice(aedValue),
    aedValue,
  };
}
