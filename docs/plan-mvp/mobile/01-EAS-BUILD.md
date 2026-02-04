# 📱 EAS BUILD — Experto Mobile

**Prioridad:** 🔴 BLOQUEANTE  
**Esfuerzo:** 4 horas (config) + 2 horas (builds)  
**Dependencias:** Cuenta Expo + Apple Developer (para iOS)  
**Bloquea a:** Demo en dispositivo real

---

## 🎯 Objetivo

Generar builds nativos de iOS y Android para poder instalar WhatsSound en dispositivos reales.

---

## 🧠 Concepto

**EAS Build** (Expo Application Services) compila la app React Native en binarios nativos en la nube. No necesitas Xcode ni Android Studio local.

```
Código Expo → EAS Build (nube) → .ipa (iOS) / .apk (Android)
```

---

## 📋 Implementación

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login en Expo

```bash
eas login
# Usar cuenta de Expo (crear si no existe)
```

### 3. Configurar proyecto

```bash
cd ~/Downloads/Leo/projects/openparty/whatssound-app
eas build:configure
```

Esto crea `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 4. Configurar app.json

Verificar que `app.json` tiene:

```json
{
  "expo": {
    "name": "WhatsSound",
    "slug": "whatssound",
    "version": "2.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "whatssound",
    "ios": {
      "bundleIdentifier": "com.whatssound.app",
      "supportsTablet": false
    },
    "android": {
      "package": "com.whatssound.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a1a"
      }
    }
  }
}
```

### 5. Build para desarrollo interno

```bash
# Android (no requiere cuenta de pago)
eas build --platform android --profile preview

# iOS (requiere Apple Developer $99/año)
eas build --platform ios --profile preview
```

### 6. Instalar en dispositivo

**Android:**
1. Escanear QR que aparece al terminar el build
2. Descargar .apk
3. Instalar (habilitar "fuentes desconocidas")

**iOS:**
1. Registrar dispositivo en Apple Developer
2. Escanear QR
3. Instalar perfil de provisioning
4. Instalar app

---

## ⚙️ Configuración Avanzada

### Variables de entorno en EAS

Crear `eas.json` con secrets:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://xxx.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJ...",
        "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY": "pk_test_..."
      }
    }
  }
}
```

O usar EAS Secrets:

```bash
eas secret:create --name SUPABASE_URL --value "https://xxx.supabase.co"
```

### Deep Links

Para que `whatssound://` funcione:

**iOS (app.json):**
```json
{
  "ios": {
    "associatedDomains": ["applinks:whatssound-app.vercel.app"]
  }
}
```

**Android (app.json):**
```json
{
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [{ "scheme": "whatssound" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

---

## 📊 Tiempos de Build

| Plataforma | Tiempo aprox. |
|------------|---------------|
| Android | 10-15 min |
| iOS | 15-25 min |

**Nota:** El primer build es más lento. Los siguientes usan caché.

---

## 🧪 Testing en Dispositivo

### Checklist de pruebas

- [ ] App abre sin crash
- [ ] Login funciona
- [ ] Sesión carga correctamente
- [ ] Audio reproduce
- [ ] Chat envía mensajes
- [ ] Propinas funcionan
- [ ] Notificaciones (si están configuradas)
- [ ] Deep links abren la app

### Dispositivos mínimos

- **iOS:** iPhone 11 o superior, iOS 14+
- **Android:** Android 10+, 4GB RAM mínimo

---

## 🚨 Troubleshooting

### "Build failed: Missing credentials"

**iOS:** Necesitas Apple Developer account ($99/año)
```bash
eas credentials
# Seguir instrucciones para crear certificados
```

**Android:** 
```bash
eas build --platform android --profile preview
# EAS genera keystore automáticamente
```

### "App crashes on launch"

1. Verificar logs: `eas build:view`
2. Revisar variables de entorno
3. Probar en Expo Go primero

### "Build queue is long"

Usa `--local` para compilar localmente (requiere Xcode/Android Studio):
```bash
eas build --platform android --local
```

---

## 📁 Archivos Involucrados

```
whatssound-app/
├── app.json              ← Configuración de app
├── eas.json              ← CREAR: Configuración EAS
├── assets/
│   ├── icon.png          ← Icono 1024x1024
│   ├── splash.png        ← Splash 1284x2778
│   └── adaptive-icon.png ← Android adaptive
```

---

## ✅ Checklist

- [ ] EAS CLI instalado
- [ ] Login en Expo
- [ ] `eas.json` configurado
- [ ] `app.json` completo
- [ ] Build Android exitoso
- [ ] Build iOS exitoso (si hay Apple Developer)
- [ ] App instalada en dispositivo
- [ ] Flujo principal funciona
- [ ] Deep links funcionan

---

## 💰 Costos

| Servicio | Costo |
|----------|-------|
| EAS Build (gratis) | 30 builds/mes |
| EAS Build (Production) | $99/mes (ilimitado) |
| Apple Developer | $99/año |
| Google Play Console | $25 (único pago) |

**Para MVP:** El tier gratuito de EAS es suficiente.

---

## 🔗 Referencias

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Signing](https://docs.expo.dev/app-signing/app-credentials/)
- Charlie Cheever (Expo founder)

---

**Firma:** 📱 Experto Mobile  
**Fuentes:** Expo Team, Infinite Red, Software Mansion
