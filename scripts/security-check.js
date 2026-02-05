#!/usr/bin/env node
/**
 * WhatsSound — Security Check Script
 * Verifica configuración de seguridad
 */

const fs = require('fs');
const path = require('path');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, fix) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (fix) console.log(`   Fix: ${fix}`);
    failed++;
  }
  checks.push({ name, passed: condition, fix });
}

console.log('🔐 WhatsSound Security Check\n');
console.log('='.repeat(50));

// 1. Check vercel.json has security headers
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
check(
  'Security headers configured',
  vercelConfig.headers && vercelConfig.headers.length > 0,
  'Add headers to vercel.json'
);

// 2. Check no hardcoded URLs
const srcFiles = [];
function findFiles(dir, ext) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.includes('node_modules')) findFiles(fullPath, ext);
    } else if (file.endsWith(ext)) {
      srcFiles.push(fullPath);
    }
  });
}
findFiles('app', '.tsx');
findFiles('src', '.ts');
findFiles('src', '.tsx');

let hardcodedUrls = 0;
srcFiles.forEach(file => {
  if (file.includes('supabase-config')) return;
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('xyehncvvvprrqwnsefcr') && !content.includes('import {')) {
    hardcodedUrls++;
  }
});
check(
  'No hardcoded Supabase URLs',
  hardcodedUrls === 0,
  'Use src/utils/supabase-config.ts'
);

// 3. Check no console.log (active)
let consoleLogs = 0;
srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Buscar console.log que NO estén comentados
  const lines = content.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.includes('console.log(') && !trimmed.startsWith('//')) {
      consoleLogs++;
    }
  });
});
check(
  'No active console.log',
  consoleLogs === 0,
  'Comment or remove console.log statements'
);

// 4. Check rate limit exists
check(
  'Rate limiting implemented',
  fs.existsSync('src/utils/rateLimit.ts'),
  'Create src/utils/rateLimit.ts'
);

// 5. Check security tests exist
check(
  'Security tests exist',
  fs.existsSync('__tests__/security'),
  'Create __tests__/security/ directory with tests'
);

// 6. Check ESLint config exists
check(
  'ESLint configured',
  fs.existsSync('.eslintrc.js') || fs.existsSync('.eslintrc.json'),
  'Create .eslintrc.js'
);

// 7. Check TypeScript strict
let tsStrict = false;
if (fs.existsSync('tsconfig.json')) {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  tsStrict = tsConfig.compilerOptions?.strict === true;
}
check(
  'TypeScript strict mode',
  tsStrict,
  'Add "strict": true to tsconfig.json'
);

// 8. Check types directory
check(
  'Type definitions exist',
  fs.existsSync('src/types/database.ts'),
  'Create src/types/database.ts'
);

// 9. Check SECURITY.md
check(
  'Security documentation',
  fs.existsSync('docs/SECURITY.md'),
  'Create docs/SECURITY.md'
);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('\n⚠️  Some security checks failed. Please review and fix.');
  process.exit(1);
} else {
  console.log('\n✨ All security checks passed!');
  process.exit(0);
}
