# AGENTS.md

This project is an Expo app using Expo Router for file-based routing.

## Setup and Development

*   **Install dependencies:** `npm install`
*   **Start the app:** `npx expo start`
*   **Run on Android:** `expo start --android`
*   **Run on iOS:** `expo start --ios`
*   **Run on Web:** `expo start --web`

## Important Commands

*   **Linting:** `expo lint`
*   **Reset Project:** `npm run reset-project` (This command moves starter code to `app-example` and creates a blank `app` directory.)

## Architecture Notes

*   **Routing:** Uses `expo-router` for file-based routing, meaning routes are defined by files within the `app` directory.
*   **Styling:** `nativewind` and `tailwindcss` are used for styling components.
*   **State Management:** `zustand` is used for managing application state.

## Entry Points

*   The main entry point is defined in `package.json` as `expo-router/entry`.
