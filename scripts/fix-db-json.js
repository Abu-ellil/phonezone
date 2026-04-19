#!/usr/bin/env node

const fs = require('fs');

const dbPath = 'src/contexts/db.json';

console.log('🔧 Fixing broken image URLs in db.json...');

try {
  const content = fs.readFileSync(dbPath, 'utf8');
  const originalContent = content;

  // Replace rawnaqstoore.com URLs with placeholder
  const fixed = content.replace(
    /https:\/\/rawnaqstoore\.com\/images\/Original\/[^"']*/g,
    '/images/placeholder.svg'
  );

  if (fixed !== originalContent) {
    fs.writeFileSync(dbPath, fixed, 'utf8');

    const originalMatches = (originalContent.match(/rawnaqstoore\.com/g) || []).length;
    const fixedMatches = (fixed.match(/rawnaqstoore\.com/g) || []).length;
    const fixes = originalMatches - fixedMatches;

    console.log(`✅ Fixed ${fixes} broken URLs in db.json`);
    console.log('✅ Cleanup complete!');
  } else {
    console.log('✓ No fixes needed in db.json');
  }

} catch (error) {
  console.error('Error:', error.message);
}