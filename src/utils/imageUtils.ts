/**
 * Validates if an image URL is accessible
 * @param url - The image URL to validate
 * @returns Promise<boolean> - True if the image is valid, false otherwise
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    // Check for invalid domains
    const invalidDomains = ['rawnaqstoore.com'];
    const urlObj = new URL(url);

    if (invalidDomains.some(domain => urlObj.hostname.includes(domain))) {
      return false;
    }

    // Try to fetch the image headers only
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Gets a safe image URL with fallback
 * @param url - The original image URL
 * @param fallbackUrl - The fallback URL (defaults to placeholder)
 * @returns Safe image URL
 */
export function getSafeImageUrl(
  url: string | undefined,
  fallbackUrl: string = '/images/placeholder.svg'
): string {
  if (!url || url.trim() === '') {
    return fallbackUrl;
  }

  try {
    const urlObj = new URL(url);

    // Check for known invalid domains
    const invalidDomains = [
      'rawnaqstoore.com',
      'rawnaq.com',
      'noon-store.com' // Add other potentially problematic domains
    ];

    // Check if the hostname includes any invalid domain
    if (invalidDomains.some(domain => urlObj.hostname.includes(domain))) {
      console.warn(`Invalid image domain detected: ${urlObj.hostname}`);
      return fallbackUrl;
    }

    // Check for Cloudinary URLs that might be broken
    if (urlObj.hostname.includes('cloudinary.com')) {
      // Check if it's from the problematic masoft account
      if (urlObj.hostname.includes('masoft')) {
        // Add timestamp to prevent caching issues
        const timestamp = Date.now();
        const separator = urlObj.search ? '&' : '?';
        return `${url}${separator}t=${timestamp}`;
      }
    }

    return url;
  } catch (error) {
    console.error('Error parsing image URL:', error);
    return fallbackUrl;
  }
}

/**
 * Preloads an image to check if it's valid
 * @param url - The image URL to preload
 * @returns Promise<boolean> - True if the image loads successfully
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}