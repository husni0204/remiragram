// @ts-check
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactHooks = require("eslint-plugin-react-hooks");

/** @type {import('eslint').Linter.Config} */
module.exports = [
  {
    ignores: ["node_modules/**", ".expo/**", "android/**", "ios/**", "dist/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        __DEV__: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "warn",
      // Allow `any` type in React Native code
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused variables (common in catch blocks, etc.)
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow require imports in Expo config files
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
