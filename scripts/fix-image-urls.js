#!/usr/bin/env node

/**
 * Script to validate and report broken image URLs in product data files
 * Run with: node scripts/fix-image-urls.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/contexts/data');
const INVALID_DOMAINS = ['rawnaqstoore.com'];

function validateImageUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, reason: 'Invalid URL' };

  try {
    const urlObj = new URL(url);

    // Check for invalid domains
    if (INVALID_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
      return { valid: false, reason: 'Invalid domain', domain: urlObj.hostname };
    }

    return { valid: true, url };
  } catch (error) {
    return { valid: false, reason: 'Parse error', error: error.message };
  }
}

function scanDataFiles() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(file => file.endsWith('.js') || file.endsWith('.json'));

  const results = {
    totalFiles: files.length,
    scannedFiles: 0,
    totalImages: 0,
    invalidImages: 0,
    issues: []
  };

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);

    try {
      // Skip if .js file (needs evaluation)
      if (file.endsWith('.js')) {
        console.log(`Skipping ${file} (JS file - manual check needed)`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      results.scannedFiles++;
      scanObject(data, file, results);

    } catch (error) {
      console.error(`Error scanning ${file}:`, error.message);
    }
  }

  return results;
}

function scanObject(obj, filename, results, path = '') {
  if (typeof obj !== 'object' || obj === null) return;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (key === 'image_url' || key === 'imageUrl') {
      results.totalImages++;
      const validation = validateImageUrl(value);

      if (!validation.valid) {
        results.invalidImages++;
        results.issues.push({
          file: filename,
          path: currentPath,
          url: value,
          reason: validation.reason,
          domain: validation.domain
        });
      }
    } else if (typeof value === 'object') {
      scanObject(value, filename, results, currentPath);
    }
  }
}

function main() {
  console.log('🔍 Scanning product data files for broken image URLs...\n');

  const results = scanDataFiles();

  console.log('📊 Scan Results:');
  console.log(`   Files scanned: ${results.scannedFiles}/${results.totalFiles}`);
  console.log(`   Total images: ${results.totalImages}`);
  console.log(`   Invalid images: ${results.invalidImages}`);

  if (results.issues.length > 0) {
    console.log('\n❌ Found issues:\n');

    // Group by reason
    const byReason = {};
    results.issues.forEach(issue => {
      if (!byReason[issue.reason]) byReason[issue.reason] = [];
      byReason[issue.reason].push(issue);
    });

    for (const [reason, issues] of Object.entries(byReason)) {
      console.log(`\n${reason} (${issues.length} occurrences):`);
      issues.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.file}: ${issue.path}`);
        console.log(`     URL: ${issue.url.substring(0, 60)}...`);
      });
      if (issues.length > 10) {
        console.log(`   ... and ${issues.length - 10} more`);
      }
    }

    console.log('\n💡 Recommendations:');
    console.log('1. Update invalid domains in data files');
    console.log('2. Remove or replace broken Cloudinary URLs');
    console.log('3. Use fallback images for missing products');

  } else {
    console.log('\n✅ No image issues found!');
  }
}

main();