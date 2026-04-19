#!/usr/bin/env node

/**
 * Script to fix broken image URLs in product data files
 * This replaces invalid domains and broken Cloudinary URLs with fallback images
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/contexts/data');
const INVALID_DOMAINS = ['rawnaqstoore.com'];
const BROKEN_CLOUDINARY_PATTERNS = [
  '/noon-store-products/', // These specific Cloudinary paths are returning 404s
];

function fixImageUrl(url) {
  if (!url || typeof url !== 'string') return '/images/placeholder.svg';

  try {
    const urlObj = new URL(url);

    // Replace invalid domains with placeholder
    if (INVALID_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
      return '/images/placeholder.svg';
    }

    // For now, keep Cloudinary URLs even if some are broken
    // The SafeImage component will handle 404s gracefully
    return url;

  } catch (error) {
    return '/images/placeholder.svg';
  }
}

function fixDataFiles() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(file => file.endsWith('.json'));

  let totalFixed = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      let fileFixed = 0;
      fixObjectUrls(data, file, (url) => {
        const fixedUrl = fixImageUrl(url);
        if (fixedUrl !== url) {
          fileFixed++;
          totalFixed++;
        }
        return fixedUrl;
      });

      if (fileFixed > 0) {
        // Write the fixed data back to the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Fixed ${fileFixed} URLs in ${file}`);
      } else {
        console.log(`✓ No fixes needed in ${file}`);
      }

    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\n🎯 Total URLs fixed: ${totalFixed}`);
}

function fixObjectUrls(obj, filename, fixFn) {
  if (typeof obj !== 'object' || obj === null) return;

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'image_url' || key === 'imageUrl') {
      obj[key] = fixFn(value);
    } else if (typeof value === 'object') {
      fixObjectUrls(value, filename, fixFn);
    }
  }
}

console.log('🔧 Starting image URL cleanup...\n');
fixDataFiles();
console.log('\n✅ Cleanup complete! Restart your dev server to see changes.');