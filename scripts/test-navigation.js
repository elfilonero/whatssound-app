#!/usr/bin/env node
/**
 * WhatsSound — Test de Navegación Automático COMPLETO
 * Escanea TODO el código y verifica que cada ruta existe
 * 
 * Ejecutar: node scripts/test-navigation.js
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

// ─── Helpers ─────────────────────────────────────────────────
function log(color, ...args) {
  console.log(color, ...args, COLORS.reset);
}

function getAllTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

function getExistingRoutes() {
  const routes = new Set();
  const files = getAllTsxFiles(APP_DIR);
  
  for (const file of files) {
    let route = file
      .replace(APP_DIR, '')
      .replace(/\.tsx$/, '')
      .replace(/\\/g, '/')
      .replace(/\/index$/, '')
      .replace(/\/_layout$/, '')
      .replace(/\/_sidebar$/, '');
    
    if (route === '') route = '/';
    if (route && route !== '/') {
      routes.add(route);
      // Add with leading slash
      if (!route.startsWith('/')) routes.add('/' + route);
    }
  }
  
  return routes;
}

function normalizeRoute(route) {
  let normalized = route.trim();
  
  // Remove query params
  normalized = normalized.replace(/\?.*$/, '');
  
  // Remove backticks
  normalized = normalized.replace(/`/g, '');
  
  // Remove trailing quotes
  normalized = normalized.replace(/['"]$/g, '');
  
  // Remove "as any" type assertions
  normalized = normalized.replace(/\s+as\s+any.*$/g, '');
  
  // Clean up any trailing whitespace
  normalized = normalized.trim();
  
  return normalized;
}

function routeMatchesDynamic(targetRoute, existingRoutes) {
  const normalizedTarget = targetRoute.replace(/^\//, '');
  const targetParts = normalizedTarget.split('/');
  
  for (const existingRoute of existingRoutes) {
    const normalizedExisting = existingRoute.replace(/^\//, '');
    const existingParts = normalizedExisting.split('/');
    
    if (targetParts.length !== existingParts.length) continue;
    
    let matches = true;
    for (let i = 0; i < targetParts.length; i++) {
      const targetPart = targetParts[i];
      const existingPart = existingParts[i];
      
      // Dynamic segment [id] or [code] matches anything
      if (existingPart.startsWith('[') && existingPart.endsWith(']')) {
        continue;
      }
      
      // Group segments like (auth) or (tabs)
      if (existingPart.startsWith('(') && existingPart.endsWith(')')) {
        if (targetPart === existingPart) continue;
        // Also try without parens
        if (targetPart === existingPart.slice(1, -1)) continue;
      }
      
      if (targetPart !== existingPart) {
        matches = false;
        break;
      }
    }
    
    if (matches) return true;
  }
  
  return false;
}

// ─── Extract All Navigation ──────────────────────────────────
function extractAllNavigation() {
  const files = getAllTsxFiles(APP_DIR);
  const navigations = [];
  
  // Patterns to match
  const patterns = [
    // router.push('/route') or router.replace('/route') - single/double quotes
    /router\.(push|replace)\s*\(\s*'([^']+)'/g,
    /router\.(push|replace)\s*\(\s*"([^"]+)"/g,
    // router.push(`/route`) - template literals without variables
    /router\.(push|replace)\s*\(\s*`([^`$]+)`/g,
    // router.push(`/route/${id}`) - template literals with variables
    /router\.(push|replace)\s*\(\s*`([^`]+)`/g,
    // router.push({ pathname: '/route' })
    /router\.(push|replace)\s*\(\s*\{\s*pathname:\s*['"]([^'"]+)['"]/g,
  ];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = file.replace(APP_DIR, 'app');
    const lines = content.split('\n');
    
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      
      while ((match = pattern.exec(content)) !== null) {
        const [fullMatch, method, route] = match;
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        // Skip if route has template variable
        const hasDynamicVar = route.includes('${');
        
        navigations.push({
          file: relativePath,
          line: lineNum,
          method,
          route: normalizeRoute(route),
          isDynamic: hasDynamicVar,
          raw: fullMatch.substring(0, 60),
        });
      }
    }
  }
  
  return navigations;
}

// ─── Extract Empty onPress ───────────────────────────────────
function extractEmptyOnPress() {
  const files = getAllTsxFiles(APP_DIR);
  const empty = [];
  
  const emptyPattern = /onPress=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/g;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = file.replace(APP_DIR, 'app');
    
    let match;
    while ((match = emptyPattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      const line = content.split('\n')[lineNum - 1] || '';
      
      empty.push({
        file: relativePath,
        line: lineNum,
        context: line.trim().substring(0, 80),
      });
    }
  }
  
  return empty;
}

// ─── Main Analysis ───────────────────────────────────────────
function runTests() {
  const existingRoutes = getExistingRoutes();
  const navigations = extractAllNavigation();
  const emptyOnPress = extractEmptyOnPress();
  
  const errors = {
    brokenLinks: [],
    emptyHandlers: emptyOnPress,
  };
  
  // Check each navigation
  for (const nav of navigations) {
    // Skip dynamic routes with ${variables}
    if (nav.isDynamic) continue;
    
    const route = nav.route;
    
    // Check if route exists
    let exists = false;
    
    // Direct match
    if (existingRoutes.has(route) || existingRoutes.has('/' + route) || existingRoutes.has(route.replace(/^\//, ''))) {
      exists = true;
    }
    
    // Match with dynamic segments
    if (!exists) {
      exists = routeMatchesDynamic(route, existingRoutes);
    }
    
    // Special cases
    if (!exists) {
      // Routes with groups like /(auth)/login should match (auth)/login
      const withoutLeadingSlash = route.replace(/^\//, '');
      if (existingRoutes.has(withoutLeadingSlash) || existingRoutes.has('/' + withoutLeadingSlash)) {
        exists = true;
      }
    }
    
    // Check if route exists in any group (tabs, auth, etc)
    if (!exists) {
      const routeWithoutGroups = route.replace(/^\//, '').replace(/\([^)]+\)\/?/g, '');
      for (const existing of existingRoutes) {
        const existingWithoutGroups = existing.replace(/^\//, '').replace(/\([^)]+\)\/?/g, '');
        if (routeWithoutGroups === existingWithoutGroups) {
          exists = true;
          break;
        }
      }
    }
    
    // Special: /(tabs) or /(auth) without specific page = valid (group root)
    if (!exists && /^\/?\([^)]+\)$/.test(route)) {
      exists = true;
    }
    
    if (!exists) {
      errors.brokenLinks.push(nav);
    }
  }
  
  return {
    stats: {
      totalFiles: getAllTsxFiles(APP_DIR).length,
      totalNavigations: navigations.length,
      staticNavigations: navigations.filter(n => !n.isDynamic).length,
      dynamicNavigations: navigations.filter(n => n.isDynamic).length,
      existingRoutes: existingRoutes.size,
    },
    errors,
    existingRoutes: Array.from(existingRoutes).sort(),
  };
}

// ─── Report ──────────────────────────────────────────────────
function printReport(result) {
  const { stats, errors } = result;
  
  console.log('\n');
  log(COLORS.bold + COLORS.blue, '═══════════════════════════════════════════════════════════════');
  log(COLORS.bold + COLORS.blue, '  🧪 WHATSSOUND — TEST DE NAVEGACIÓN COMPLETO');
  log(COLORS.bold + COLORS.blue, '═══════════════════════════════════════════════════════════════\n');
  
  // Stats
  log(COLORS.cyan, '  📊 ESTADÍSTICAS:');
  log(COLORS.dim, `     Archivos analizados:    ${stats.totalFiles}`);
  log(COLORS.dim, `     Rutas existentes:       ${stats.existingRoutes}`);
  log(COLORS.dim, `     Navegaciones totales:   ${stats.totalNavigations}`);
  log(COLORS.dim, `        - Estáticas:         ${stats.staticNavigations}`);
  log(COLORS.dim, `        - Dinámicas:         ${stats.dynamicNavigations}`);
  
  const totalErrors = errors.brokenLinks.length + errors.emptyHandlers.length;
  
  if (totalErrors === 0) {
    log(COLORS.green, '\n  ✅ TODOS LOS TESTS PASADOS');
    log(COLORS.green, '     No se encontraron enlaces rotos ni botones sin acción.\n');
    return 0;
  }
  
  // Broken links
  if (errors.brokenLinks.length > 0) {
    log(COLORS.red, `\n  ❌ ENLACES ROTOS (${errors.brokenLinks.length}):`);
    for (const err of errors.brokenLinks) {
      log(COLORS.yellow, `\n     ${err.file}:${err.line}`);
      log(COLORS.reset, `        router.${err.method}('${err.route}')`);
      log(COLORS.red, `        → RUTA NO EXISTE`);
    }
  }
  
  // Empty onPress (just warn, don't fail)
  if (errors.emptyHandlers.length > 0) {
    log(COLORS.yellow, `\n  ⚠️  BOTONES SIN ACCIÓN (${errors.emptyHandlers.length}):`);
    for (const err of errors.emptyHandlers) {
      log(COLORS.dim, `     ${err.file}:${err.line}`);
      log(COLORS.dim, `        ${err.context}`);
    }
  }
  
  log(COLORS.bold + COLORS.red, `\n  ══════════════════════════════════════════════════════════════`);
  log(COLORS.bold + COLORS.red, `  ERRORES: ${errors.brokenLinks.length} enlaces rotos, ${errors.emptyHandlers.length} botones vacíos`);
  log(COLORS.bold + COLORS.red, `  ══════════════════════════════════════════════════════════════\n`);
  
  return errors.brokenLinks.length > 0 ? 1 : 0;
}

// ─── Run ─────────────────────────────────────────────────────
const result = runTests();
const exitCode = printReport(result);

// Generate JSON report
const reportPath = path.join(__dirname, '..', 'navigation-test-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  ...result,
}, null, 2));

console.log(`  📄 Reporte guardado en: navigation-test-report.json\n`);

process.exit(exitCode);
