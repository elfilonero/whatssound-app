# 📱 DEEP LINKS — Experto Mobile

**Prioridad:** 🟢 Media  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

Links que abren directamente una sesión en la app: `whatssound://session/abc123`

---

## 📋 Configuración

### app.json
```json
{
  "expo": {
    "scheme": "whatssound",
    "ios": {
      "bundleIdentifier": "com.whatssound.app",
      "associatedDomains": [
        "applinks:whatssound-app.vercel.app"
      ]
    },
    "android": {
      "package": "com.whatssound.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            { "scheme": "whatssound" },
            { 
              "scheme": "https",
              "host": "whatssound-app.vercel.app",
              "pathPrefix": "/join"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Manejo en app

```typescript
// app/_layout.tsx

import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { path, queryParams } = Linking.parse(event.url);
      
      if (path?.startsWith('session/') || path?.startsWith('join/')) {
        const sessionId = path.split('/')[1];
        router.push(`/session/${sessionId}`);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Manejar link inicial (app cerrada)
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  // ...
}
```

---

## 🔗 URLs Soportadas

| URL | Acción |
|-----|--------|
| `whatssound://session/abc123` | Abrir sesión |
| `https://whatssound-app.vercel.app/join/abc123` | Abrir sesión (universal) |
| `whatssound://profile/xyz` | Ver perfil |

---

## ✅ Checklist

- [ ] Scheme configurado en app.json
- [ ] Associated domains (iOS)
- [ ] Intent filters (Android)
- [ ] Handler de deep links
- [ ] Probado con app cerrada
- [ ] Probado con app abierta
- [ ] Universal links funcionan

---

**Firma:** 📱 Experto Mobile
