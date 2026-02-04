# 🚀 GITHUB ACTIONS — Experto DevOps

**Prioridad:** 🟢 Media  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

CI/CD automático: tests en cada PR, deploy en cada push a main.

---

## 📋 Workflow Principal

```yaml
# .github/workflows/ci.yml

name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Type check
        run: npx tsc --noEmit

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔐 Secrets Necesarios

En GitHub → Settings → Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## ✅ Checklist

- [ ] Workflow creado
- [ ] Secrets configurados
- [ ] Tests pasan en CI
- [ ] Deploy automático funciona
- [ ] Badge de status en README

---

**Firma:** 🚀 Experto DevOps
