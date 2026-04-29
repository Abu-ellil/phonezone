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

    // Upgrade Amazon image URLs to higher resolution
    if (urlObj.hostname.includes('media-amazon.com')) {
      // Remove size suffixes like ._AC_UY400_ or ._AC_SL300_
      let upgraded = url.replace(/\._[^.]*_/, '.');
      // If no size suffix exists, ensure we get a decent size
      if (upgraded === url && !url.includes('._')) {
        // Try to insert high-res indicator before extension
        upgraded = url.replace(/(\.jpg|\.png|\.jpeg|\.gif)/i, '._AC_SL1500_$1');
      }
      return upgraded;
    }

    // Upgrade Noon CDN image URLs
    if (urlObj.hostname.includes('nooncdn') || urlObj.hostname.includes('noon.post')) {
      let upgraded = url.replace(/\/w\d+\//, '/w1200/');
      upgraded = upgraded.replace(/\/h\d+\//, '/h1200/');
      return upgraded;
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