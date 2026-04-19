#!/usr/bin/env node

/**
 * Script to fix all broken Cloudinary images by replacing them with placeholder images
 * Usage: node scripts/fixBrokenImages.js
 */

const fs = require('fs');
const path = require('path');

// Alternative image sources (using reliable public domain/CC0 images)
const ALTERNATIVE_IMAGES = {
  iphone: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', // iPhone
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop', // Smartphone
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop', // iPhone
  ],
  samsung: [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop', // Samsung Galaxy
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', // Smartphone
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop', // Samsung
  ],
  watch: [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop', // Smart Watch
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop', // Apple Watch
  ],
  playstation: [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', // PlayStation
    'https://images.unsplash.com/photo-1486575809139-b764435651a0?w=400&h=400&fit=crop', // Gaming
  ],
  accessories: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1572569028738-411a2963c3f2?w=400&h=400&fit=crop', // Tech accessories
  ],
  default: [
    '/images/placeholder.svg',
    '/images/placeholder.svg',
    '/images/placeholder.svg',
  ]
};

function getAlternativeImage(productName, category) {
  let categoryType = 'default';

  if (productName && (productName.includes('iPhone') || productName.includes('ايفون'))) {
    categoryType = 'iphone';
  } else if (productName && (productName.includes('Samsung') || productName.includes('سامسونج') || productName.includes('Galaxy'))) {
    categoryType = 'samsung';
  } else if (category && category.includes('ساعات')) {
    categoryType = 'watch';
  } else if (productName && productName.includes('PlayStation')) {
    categoryType = 'playstation';
  } else if (category && category.includes('اكسسوارات')) {
    categoryType = 'accessories';
  }

  const images = ALTERNATIVE_IMAGES[categoryType];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

function isBrokenCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('cloudinary.com') &&
           urlObj.pathname.includes('noon-store-products');
  } catch {
    return false;
  }
}

function fixDataFile(filePath) {
  console.log(`\n🔧 Processing: ${path.basename(filePath)}`);

  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixedCount = 0;

  // Find and replace broken image URLs
  const fixedContent = content.replace(
    /"image_url":\s*"([^"]+)"/g,
    (match, imageUrl) => {
      if (isBrokenCloudinaryUrl(imageUrl)) {
        modified = true;
        fixedCount++;

        // Try to extract product info from context
        const productNameMatch = content.match(/"name":\s*"([^"]+)"/);
        const productName = productNameMatch ? productNameMatch[1] : '';

        const categoryMatch = content.match(/"category":\s*\[([^\]]+)\]/);
        const category = categoryMatch ? categoryMatch[1] : '';

        const alternativeImage = getAlternativeImage(productName, category);

        console.log(`  ✏️  Fixed: ${imageUrl.substring(0, 50)}...`);
        console.log(`     → ${alternativeImage}`);

        return `"image_url": "${alternativeImage}"`;
      }
      return match;
    }
  );

  if (modified) {
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, content);
    console.log(`  💾 Backup created: ${path.basename(backupPath)}`);

    // Write fixed version
    fs.writeFileSync(filePath, fixedContent);
    console.log(`  ✅ Fixed ${fixedCount} images in ${path.basename(filePath)}`);
    return fixedCount;
  } else {
    console.log(`  ✅ No broken images found`);
    return 0;
  }
}

// Main execution
console.log('🔍 Starting broken image fix...\n');

const dataDir = path.join(__dirname, '../src/contexts/data');
const dataFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.js'));

let totalFixed = 0;
let processedFiles = 0;

dataFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  const fixedCount = fixDataFile(filePath);
  totalFixed += fixedCount;
  if (fixedCount > 0) processedFiles++;
});

console.log('\n📊 Summary:');
console.log(`Files processed: ${dataFiles.length}`);
console.log(`Files modified: ${processedFiles}`);
console.log(`Total images fixed: ${totalFixed}`);

if (totalFixed > 0) {
  console.log('\n💡 Tips:');
  console.log('1. Test the application to verify images load correctly');
  console.log('2. Replace placeholder images with actual product photos');
  console.log('3. Consider using a reliable CDN for product images');
  console.log('4. Backups created with .backup extension');
  console.log('\n🔄 To restore backups: for file in src/contexts/data/*.backup; do mv "$file" "${file%.backup}"; done');
} else {
  console.log('\n✅ All images are already working!');
}

process.exit(totalFixed > 0 ? 0 : 1);
