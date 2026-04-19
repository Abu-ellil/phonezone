/**
 * Image Management System
 * Handles image validation, fallbacks, and CDN management
 */

export interface ImageSource {
  url: string;
  type: 'primary' | 'fallback' | 'placeholder';
  category: string;
}

export class ImageManager {
  private static instance: ImageManager;
  private imageCache: Map<string, ImageSource[]> = new Map();

  private constructor() {
    this.initializeImageSources();
  }

  static getInstance(): ImageManager {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager();
    }
    return ImageManager.instance;
  }

  private initializeImageSources() {
    // Primary CDN sources
    const primarySources: ImageSource[] = [
      {
        url: 'https://store.storeimages.cdn-apple.com',
        type: 'primary',
        category: 'apple'
      },
      {
        url: 'https://images.samsung.com',
        type: 'primary',
        category: 'samsung'
      }
    ];

    // Fallback sources
    const fallbackSources: ImageSource[] = [
      {
        url: '/images/placeholder.svg',
        type: 'placeholder',
        category: 'default'
      }
    ];

    // Cache sources by category
    this.imageCache.set('apple', primarySources.filter(s => s.category === 'apple'));
    this.imageCache.set('samsung', primarySources.filter(s => s.category === 'samsung'));
    this.imageCache.set('default', fallbackSources);
  }

  /**
   * Get the best available image URL for a product
   */
  getImageUrl(productName: string, category: string = 'default'): string {
    const categoryType = this.categorizeProduct(productName, category);
    const sources = this.imageCache.get(categoryType) || this.imageCache.get('default')!;

    // Return the first available source
    return sources[0]?.url || '/images/placeholder.svg';
  }

  /**
   * Categorize product based on name and category
   */
  private categorizeProduct(productName: string, category: string): string {
    const name = productName.toLowerCase();

    if (name.includes('iphone') || name.includes('ايفون') || name.includes('apple') || name.includes('ابل')) {
      return 'apple';
    }
    if (name.includes('samsung') || name.includes('سامسونج') || name.includes('galaxy')) {
      return 'samsung';
    }
    if (category.includes('ساعات') || name.includes('watch')) {
      return 'apple'; // Apple Watch
    }

    return 'default';
  }

  /**
   * Validate if an image URL is accessible
   */
  async validateImageUrl(url: string): Promise<boolean> {
    try {
      // Skip local URLs
      if (url.startsWith('/') || url.startsWith('data:')) {
        return true;
      }

      // Check for known problematic domains
      const invalidDomains = ['rawnaqstoore.com', 'rawnaq.com'];
      const urlObj = new URL(url);

      if (invalidDomains.some(domain => urlObj.hostname.includes(domain))) {
        return false;
      }

      // Check for broken Cloudinary URLs
      if (urlObj.hostname.includes('cloudinary.com')) {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get fallback image URL
   */
  getFallbackImageUrl(productName: string = '', category: string = 'default'): string {
    const categoryType = this.categorizeProduct(productName, category);

    // Apple products
    if (categoryType === 'apple') {
      const appleImages = [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-7inch-deserttitanium?wid=400',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-7inch-titaniumwhite?wid=400',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-7inch-titaniumblack?wid=400',
      ];
      return appleImages[Math.floor(Math.random() * appleImages.length)];
    }

    // Samsung products
    if (categoryType === 'samsung') {
      const samsungImages = [
        'https://images.samsung.com/is/image/samsung/p6pim/uk/2501/gallery/uk-galaxy-s25-ultra-s928-sm-s928bztpeub-thumb-539573637?wid=400',
      ];
      return samsungImages[Math.floor(Math.random() * samsungImages.length)];
    }

    // Default placeholder
    return '/images/placeholder.svg';
  }

  /**
   * Process and validate image URL
   */
  async processImageUrl(url: string, productName: string = '', category: string = 'default'): Promise<string> {
    if (!url || url.trim() === '') {
      return this.getFallbackImageUrl(productName, category);
    }

    // Check if URL is valid
    const isValid = await this.validateImageUrl(url);

    if (!isValid) {
      console.warn(`Invalid image URL detected: ${url}`);
      return this.getFallbackImageUrl(productName, category);
    }

    return url;
  }
}

// Export singleton instance
export const imageManager = ImageManager.getInstance();
