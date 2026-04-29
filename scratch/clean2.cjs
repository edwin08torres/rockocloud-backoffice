const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // 1. Remove multi-line block comments  /* ... */
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Remove single-line // comments (but NOT URLs like http:// or https://)
  //    Match lines where // appears and is NOT inside a string or a URL
  content = content.replace(/^([ \t]*)\/\/.*$/gm, '');

  // Also remove inline // comments at end of lines (careful with URLs)
  // Match // that is NOT preceded by : (to avoid http:// https://)
  content = content.replace(/([^:])\/\/(?!\/)\s.*$/gm, '$1');

  // 3. Clean up: remove lines that are now completely empty due to comment removal
  //    but keep intentional blank lines (max 1 consecutive blank line)
  content = content.replace(/\n{3,}/g, '\n\n');

  // 4. Remove trailing whitespace on each line
  content = content.replace(/[ \t]+$/gm, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned: ' + file);
  }
});

console.log('Done!');
