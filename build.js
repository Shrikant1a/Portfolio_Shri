const fs = require('fs');
const path = require('path');

console.log('🚀 Starting portfolio build for deployment...');

const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists and is clean
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Files and folders to copy to dist
const itemsToCopy = [
  'index.html',
  'style.css',
  'script.js',
  'assets'
];

itemsToCopy.forEach((item) => {
  const src = path.join(__dirname, item);
  const dest = path.join(distDir, item);

  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
      console.log(`📁 Copied directory: ${item} -> dist/${item}`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`📄 Copied file: ${item} -> dist/${item}`);
    }
  } else {
    console.warn(`⚠️ Warning: ${item} not found at ${src}`);
  }
});

console.log('✅ Build successful! Deployable assets ready in dist/ directory.');
