# 🎤 Sensai - Voice AI Interaction Platform

Real-time voice interaction app powered by Google's Gemini Live API. Speak naturally and get instant voice responses from AI.

## ✨ Features

- 🎙️ **Voice Recording**: Record audio directly in the browser
- 🤖 **Gemini AI**: Powered by Google's Gemini 2.5 Flash with native audio
- 🔊 **Voice Responses**: Get natural-sounding AI voice responses
- 💫 **Real-time Feedback**: Visual indicators for recording, processing, and playback
- 🎨 **Beautiful UI**: Modern interface with Spline 3D scene

## 🚀 Quick Start

### Automated Setup (Recommended)

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### Manual Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📋 Prerequisites

- Node.js v18+
- FFmpeg (for audio conversion)
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🎯 How It Works

1. Click the microphone button
2. Speak your message
3. Click again to stop
4. AI processes and responds with voice

## 📁 Project Structure

```
sensai/
├── server/              # Node.js/Express backend with Gemini integration
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   └── config/         # Configuration
└── docs/               # Documentation
```

## 🛠️ Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Spline 3D
- Web Audio API

**Backend:**
- Node.js + Express + TypeScript
- Google Gemini Live API
- FFmpeg (audio conversion)
- WebSocket connections

## 📚 Documentation

- [Complete Setup Guide](./SETUP_GUIDE.md)
- [Quick Start](./QUICKSTART.md)
- [Voice Setup Details](./VOICE_SETUP.md)
- [Server Documentation](./server/README.md)

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
