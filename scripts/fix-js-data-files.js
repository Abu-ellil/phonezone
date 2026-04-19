#!/usr/bin/env node

/**
 * Quick fix for broken image URLs in JS data files
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/contexts/data');

console.log('🔧 Fixing broken image URLs in JS data files...\n');

const files = fs.readdirSync(DATA_DIR)
  .filter(file => file.endsWith('.js') && file !== 'index.js');

let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Replace rawnaqstoore.com URLs with placeholder
    content = content.replace(
      /https:\/\/rawnaqstoore\.com\/[^"']*/g,
      '/images/placeholder.svg'
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      const fixes = (content.match(/\/images\/placeholder\.svg/g) || []).length -
                    (originalContent.match(/\/images\/placeholder\.svg/g) || []).length;
      totalFixed += fixes;
      console.log(`✅ Fixed ${fixes} URLs in ${file}`);
    } else {
      console.log(`✓ No fixes needed in ${file}`);
    }

  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`\n🎯 Total URLs fixed: ${totalFixed}`);
console.log('\n✅ Now restart your dev server: Ctrl+C then npm run dev');