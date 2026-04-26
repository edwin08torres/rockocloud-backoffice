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
  let original = content;

  // Since multiline imports like "import { \n A, \n B } from 'c';" are tricky to regex in one go,
  // let's do a simpler approach: finding all import statements.
  // We'll split the file by lines and collect imports until we hit the first non-import line 
  // (ignoring empty lines).
  
  const lines = content.split(/\r?\n/);
  
  const importBlocks = [];
  let currentBlock = [];
  let inImport = false;
  let remainingLines = [];
  
  let finishedImports = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!finishedImports) {
      if (trimmed.startsWith('import ')) {
        inImport = true;
        currentBlock.push(line);
        if (trimmed.endsWith(';') || trimmed.match(/['"]$/)) {
          inImport = false;
          importBlocks.push(currentBlock.join('\n'));
          currentBlock = [];
        }
      } else if (inImport) {
        currentBlock.push(line);
        if (trimmed.endsWith(';') || trimmed.match(/['"]$/)) {
          inImport = false;
          importBlocks.push(currentBlock.join('\n'));
          currentBlock = [];
        }
      } else if (trimmed === '') {
        // ignore empty lines while reading imports
      } else {
        finishedImports = true;
        remainingLines.push(line);
      }
    } else {
      remainingLines.push(line);
    }
  }

  if (importBlocks.length === 0) return;

  const external = [];
  const internalParent = [];
  const internalSibling = [];

  importBlocks.forEach(imp => {
    if (imp.includes("'../") || imp.includes('"../')) internalParent.push(imp);
    else if (imp.includes("'./") || imp.includes('"./')) internalSibling.push(imp);
    else external.push(imp);
  });

  const sortFn = (a, b) => {
    const fromA = a.match(/from\s+['"]([^'"]+)['"]/);
    const fromB = b.match(/from\s+['"]([^'"]+)['"]/);
    const valA = fromA ? fromA[1] : a;
    const valB = fromB ? fromB[1] : b;
    return valA.localeCompare(valB);
  };

  external.sort(sortFn);
  internalParent.sort(sortFn);
  internalSibling.sort(sortFn);

  let newImports = '';
  if (external.length > 0) newImports += external.join('\n') + '\n\n';
  if (internalParent.length > 0) newImports += internalParent.join('\n') + '\n\n';
  if (internalSibling.length > 0) newImports += internalSibling.join('\n') + '\n\n';

  content = newImports.trim() + '\n\n' + remainingLines.join('\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Sorted imports in: ' + file);
  }
});
