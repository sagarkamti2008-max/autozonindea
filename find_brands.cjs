const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        searchFiles(filePath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        // Regex to find 'brands' not preceded by '.' or '{ ' or followed by ':'
        // A simple check is to find 'brands' and just print the line.
        if (/\bbrands\b/.test(lines[i])) {
           // We are looking for something like `brands.find` or `brands.map` where brands is not in scope.
           console.log(`${filePath}:${i+1}: ${lines[i].trim()}`);
        }
      }
    }
  }
}

searchFiles(path.join(__dirname, 'src'));
