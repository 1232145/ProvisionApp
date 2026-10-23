const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'public', 'electron.js');
const dest = path.join(__dirname, 'build', 'electron.js');
const preloadSource = path.join(__dirname, 'public', 'preload.js');
const preloadDest = path.join(__dirname, 'build', 'preload.js');

// Ensure build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy the file
fs.copyFileSync(source, dest);
console.log(`Copied ${source} to ${dest}`);
fs.copyFileSync(preloadSource, preloadDest);
console.log(`Copied ${preloadSource} to ${preloadDest}`);
