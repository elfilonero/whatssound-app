# 📱 EAS Build — WhatsSound

## Pre-requisitos

1. **Cuenta Expo** → https://expo.dev
2. **EAS CLI instalado:**
   ```bash
   npm install -g eas-cli
   eas login
   ```

3. **Arreglar permisos npm (si hay error):**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

4. **Instalar dependencias:**
   ```bash
   npx expo install expo-dev-client expo-updates
   ```

---

## Configuración

### eas.json (ya creado)
- `development` → Build con dev client para testing local
- `preview` → Build interno para testers (APK/IPA)
- `production` → Build para stores (AAB/IPA)

### Credenciales

**Android:**
- EAS genera automáticamente el keystore
- Para producción: configurar Google Play Console

**iOS:**
- Requiere Apple Developer Account ($99/año)
- EAS puede manejar provisioning profiles automáticamente

---

## Comandos

### Development Build (para testing)
```bash
# Android APK
eas build --profile development --platform android

# iOS (requiere Apple Developer)
eas build --profile development --platform ios
```

### Preview Build (para testers)
```bash
# Android APK
eas build --profile preview --platform android

# iOS Ad-hoc
eas build --profile preview --platform ios
```

### Production Build
```bash
# Android AAB (Google Play)
eas build --profile production --platform android

# iOS (App Store)
eas build --profile production --platform ios
```

---

## Primer Build

1. **Configurar proyecto en Expo:**
   ```bash
   eas build:configure
   ```

2. **Build Android (más fácil, sin cuenta Apple):**
   ```bash
   eas build --profile preview --platform android
   ```

3. **Descargar APK** desde https://expo.dev

4. **Instalar en dispositivo** o emulador

---

## Features que requieren build nativo

| Feature | Expo Go | EAS Build |
|---------|---------|-----------|
| Background Audio | ❌ | ✅ |
| Push Notifications | ⚠️ limitado | ✅ |
| Deep Links nativos | ❌ | ✅ |
| In-App Purchases | ❌ | ✅ |
| Foreground Service (Android) | ❌ | ✅ |

---

## Timeline estimado

| Build | Tiempo |
|-------|--------|
| Android APK | ~10-15 min |
| Android AAB | ~15-20 min |
| iOS | ~20-30 min |

---

## Siguiente paso: Producción

### Google Play
1. Crear cuenta Google Play Console ($25 una vez)
2. Crear app en consola
3. `eas submit --platform android`

### App Store
1. Crear cuenta Apple Developer ($99/año)
2. Crear app en App Store Connect
3. Configurar `eas.json` con IDs de Apple
4. `eas submit --platform ios`

---

*Documentación creada: 2026-02-04*
