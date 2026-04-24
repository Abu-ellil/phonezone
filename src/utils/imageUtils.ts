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
    return !!(response.ok && response.headers.get('content-type')?.startsWith('image/'));
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

  // Relative paths (e.g. "/images/placeholder.svg") are safe as-is
  if (url.startsWith('/')) {
    return url;
  }

  try {
    const urlObj = new URL(url);

    const invalidDomains = [
      'rawnaqstoore.com',
      'rawnaq.com',
      'noon-store.com'
    ];

    if (invalidDomains.some(domain => urlObj.hostname.includes(domain))) {
      return fallbackUrl;
    }

    if (urlObj.hostname.includes('cloudinary.com') && urlObj.hostname.includes('masoft')) {
      const timestamp = Date.now();
      const separator = urlObj.search ? '&' : '?';
      return `${url}${separator}t=${timestamp}`;
    }

    return url;
  } catch {
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