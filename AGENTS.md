# AGENTS.md

## Quick setup
- **Install deps:** `npm install` – required before any other command.
- **Start dev server:** `npx expo start` (or `npm run start`).` This launches Metro and shows Android/iOS/Web options.
- **Platform shortcuts:** `expo start --android`, `--ios`, `--web`.
- **Reset starter:** `npm run reset-project` moves the template to `app-example` and creates an empty `app` folder (as described in README).

## Core commands
- **Lint:** `expo lint` (the only lint script provided).
- **Run tests / type‑check:** none defined – rely on TypeScript compiler (`tsc`) if needed.

## Architecture signals
- **Routing:** Expo Router uses file‑based routes under the `app/` directory (e.g., `(auth)`, `(tabs)`, `_layout.tsx`).
- **Styling:** Tailwind via `nativewind` and `tailwindcss`; class names are interpreted at runtime.
- **State:** Global state lives in `src/stores/*` (Zustand). Auth token is saved in `expo-secure-store` and user data in `AsyncStorage`.
- **API base URL:** read from `EXPO_PUBLIC_API_URL` in `.env` – agents must load this env file for network calls.

## Entry point
- The main entry is `expo-router/entry` as set in `package.json` (`main` field).

## Dev notes
- **TypeScript config:** `tsconfig.json` extends `expo/tsconfig.base` and defines path alias `@/*` → project root (useful for imports).
- **ESLint:** uses Expo preset; ignores `dist/*`.

*Only items that an agent would likely miss without explicit guidance are listed.*