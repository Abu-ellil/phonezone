#!/usr/bin/env node

const fs = require('fs');

const dbPath = 'src/contexts/db.json';

console.log('🔧 Comprehensive fix for all broken URLs in db.json...');

try {
  const content = fs.readFileSync(dbPath, 'utf8');

  // Fix ALL rawnaqstoore.com URLs (both url and image_url fields)
  const fixed = content.replace(
    /https:\/\/rawnaqstoore\.com\/[^"']*/g,
    '/images/placeholder.svg'
  );

  fs.writeFileSync(dbPath, fixed, 'utf8');

  const remaining = (fixed.match(/rawnaqstoore\.com/g) || []).length;
  console.log(`✅ Fixed all broken URLs!`);
  console.log(`📊 Remaining broken URLs: ${remaining}`);

  if (remaining === 0) {
    console.log('🎉 All broken URLs have been fixed!');
  }

} catch (error) {
  console.error('Error:', error.message);
}