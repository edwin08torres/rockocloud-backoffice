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

  // 1. Replace hardcoded API_URL with env var
  content = content.replace(
    /const API_URL\s*=\s*['"]http:\/\/localhost:5165['"]\s*;?/g,
    'const API_URL = import.meta.env.VITE_API_URL;'
  );
  content = content.replace(
    /const API_URL\s*=\s*'http:\/\/localhost:5165'\s*$/gm,
    "const API_URL = import.meta.env.VITE_API_URL"
  );

  // 2. Replace relative imports with @ alias
  // ../stores/ -> @/stores/
  content = content.replace(/from\s+['"]\.\.\/stores\//g, 'from "@/stores/');
  // ../layouts/ -> @/layouts/
  content = content.replace(/from\s+['"]\.\.\/layouts\//g, 'from "@/layouts/');
  // ../pages/ -> @/pages/
  content = content.replace(/from\s+['"]\.\.\/pages\//g, 'from "@/pages/');
  // ../components/ -> @/components/
  content = content.replace(/from\s+['"]\.\.\/components\//g, 'from "@/components/');

  // For App.tsx which uses ./layouts/, ./pages/, ./stores/
  content = content.replace(/from\s+['"]\.\/layouts\//g, 'from "@/layouts/');
  content = content.replace(/from\s+['"]\.\/pages\//g, 'from "@/pages/');
  content = content.replace(/from\s+['"]\.\/stores\//g, 'from "@/stores/');
  content = content.replace(/from\s+['"]\.\/components\//g, 'from "@/components/');

  // Fix any single quotes left after replacement to use double quotes consistently
  // The replacements above already use double quotes

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});

console.log('Done!');
