# GestorCSS — React Native (Expo + NativeWind)

Aplicación móvil del Gestor de Horas Sociales, construida con **Expo**, **React Native** y **NativeWind** (Tailwind CSS para React Native).

## 🚀 Stack

| Herramienta | Versión | Descripción |
|---|---|---|
| [Expo](https://expo.dev) | ~51 | Framework mobile |
| [React Native](https://reactnative.dev) | 0.74 | UI nativa |
| [Expo Router](https://expo.github.io/router) | ~3.5 | Navegación basada en archivos |
| [NativeWind](https://nativewind.dev) | ^4 | Tailwind CSS para React Native |
| [TypeScript](https://www.typescriptlang.org) | ^5.4 | Type safety |
| [Zustand](https://zustand-demo.pmnd.rs) | ^4.5 | State management |
| [TanStack Query](https://tanstack.com/query) | ^5 | Data fetching |

## 📁 Estructura del proyecto

```
├── app/                        # Rutas (Expo Router)
│   ├── _layout.tsx             # Layout raíz
│   ├── login.tsx               # Pantalla de login
│   └── (tabs)/
│       ├── _layout.tsx         # Layout de navegación por pestañas
│       ├── index.tsx           # Pantalla principal (Inicio)
│       └── profile.tsx         # Pantalla de perfil
├── components/
│   ├── ui/                     # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Text.tsx
│   │   └── index.ts
│   └── features/               # Componentes específicos del negocio
├── constants/
│   └── index.ts                # Constantes de la aplicación
├── hooks/
│   └── useAuth.ts              # Hook de autenticación
├── lib/
│   └── utils.ts                # Utilidades (cn, formatDate, etc.)
├── nativewind/
│   └── tailwind.css            # Entrada CSS de NativeWind
├── types/
│   └── index.ts                # Tipos TypeScript globales
├── app.json                    # Configuración de Expo
├── babel.config.js             # Babel (Expo + NativeWind)
├── metro.config.js             # Metro bundler con NativeWind
├── tailwind.config.ts          # Configuración Tailwind/NativeWind
└── tsconfig.json               # TypeScript para React Native
```

## ⚙️ Configuración inicial

### 1. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con los valores correctos:

```env
EXPO_PUBLIC_API_URL=https://api.tu-servidor.com
EXPO_PUBLIC_APP_NAME=GestorCSS
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
# Menú interactivo (elige plataforma con a/i/w)
npm start

# Android directamente
npm run android

# iOS directamente (solo macOS)
npm run ios

# Web
npm run web
```

## 🔧 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor Expo |
| `npm run android` | Lanza en Android |
| `npm run ios` | Lanza en iOS |
| `npm run web` | Lanza en navegador web |
| `npm run lint` | Ejecuta ESLint |
| `npm run typescript` | Verifica tipos TypeScript |

## 🗂️ Código web legacy

El directorio `src/` contiene el código React web original (Vite) que sirve como referencia para la migración de componentes y lógica de negocio.

