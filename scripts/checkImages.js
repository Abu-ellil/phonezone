#!/usr/bin/env node

/**
 * Script to check all product images and identify broken URLs
 * Usage: node scripts/checkImages.js
 */

const fs = require('fs');
const path = require('path');

// List of problematic domains
const PROBLEMATIC_DOMAINS = [
  'rawnaqstoore.com',
  'rawnaq.com',
  'noon-store.com'
];

// Read all data files
const dataDir = path.join(__dirname, '../src/contexts/data');
const dataFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.js'));

let totalProducts = 0;
let brokenImages = 0;
let domainStats = {};

console.log('🔍 Checking product images...\n');

dataFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract image URLs using regex
  const imageRegex = /"image_url":\s*"([^"]+)"/g;
  let match;
  const fileImages = [];

  while ((match = imageRegex.exec(content)) !== null) {
    const imageUrl = match[1];
    totalProducts++;
    fileImages.push(imageUrl);

    try {
      // Skip relative URLs and placeholders
      if (imageUrl.startsWith('/') || imageUrl.startsWith('images/')) {
        totalProducts--; // Don't count placeholders
        continue;
      }

      const urlObj = new URL(imageUrl);
      const domain = urlObj.hostname;

      if (!domainStats[domain]) {
        domainStats[domain] = { count: 0, broken: 0 };
      }
      domainStats[domain].count++;

      // Check if domain is problematic
      if (PROBLEMATIC_DOMAINS.some(problematic => domain.includes(problematic))) {
        brokenImages++;
        domainStats[domain].broken++;
        console.log(`❌ BROKEN: ${imageUrl} (in ${file})`);
      }
    } catch (error) {
      // Skip invalid URLs (relative paths, etc.)
      if (!imageUrl.startsWith('/')) {
        console.log(`⚠️  INVALID URL: ${imageUrl} (in ${file})`);
        brokenImages++;
      }
    }
  }
});

// Print statistics
console.log('\n📊 Statistics:');
console.log(`Total products: ${totalProducts}`);
console.log(`Broken images: ${brokenImages}`);
console.log(`Success rate: ${((totalProducts - brokenImages) / totalProducts * 100).toFixed(2)}%\n`);

console.log('🌐 Domain breakdown:');
Object.entries(domainStats)
  .sort(([,a], [,b]) => b.count - a.count)
  .forEach(([domain, stats]) => {
    const brokenPercentage = (stats.broken / stats.count * 100).toFixed(1);
    console.log(`  ${domain}:`);
    console.log(`    Total: ${stats.count}`);
    console.log(`    Broken: ${stats.broken} (${brokenPercentage}%)`);
  });

// Generate recommendations
console.log('\n💡 Recommendations:');
if (brokenImages > 0) {
  console.log('  1. Replace all images from problematic domains');
  console.log('  2. Use a reliable CDN service');
  console.log('  3. Implement image validation in product upload');
  console.log('  4. Set up monitoring for broken images');
} else {
  console.log('  ✅ All images appear to be from valid domains!');
}

// Exit with error code if broken images found
process.exit(brokenImages > 0 ? 1 : 0);
