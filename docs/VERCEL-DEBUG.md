# Vercel Debug - Serverless Functions

## Problema
La función `/api/regenerate-boosts.js` no se detecta en Vercel.

## Lo que funciona
- `/api/deezer` ✅
- `/api/setup-db` ✅
- `/api/vote` ✅

## Lo que NO funciona
- `/api/regenerate-boosts` ❌ (retorna HTML en lugar de JSON)

## Verificaciones hechas
1. ✅ Archivo está en GitHub: `api/regenerate-boosts.js`
2. ✅ Formato CommonJS igual que otros archivos
3. ✅ vercel.json excluye `/api` del rewrite a index.html
4. ❌ Vercel no detecta la función en el deploy

## Posibles causas
1. Cache de Vercel (age: 50861 segundos = 14h)
2. Deployment no se ejecutó correctamente
3. Vercel necesita redeploy manual desde dashboard

## Para verificar en Vercel Dashboard
1. Settings → Git → Ver si está conectado a `elfilonero/whatssound-app`
2. Deployments → Ver último deployment exitoso
3. Functions tab → Verificar si `regenerate-boosts` aparece

## Commits recientes
- `2745cd6` - fix: Match export format with other API files
- `d9aa08c` - fix: Convert regenerate-boosts to JS (CommonJS)
- `85f29cd` - chore: force rebuild
- `1b15801` - fix: Move regenerate-boosts to api root (no subdirectory)
