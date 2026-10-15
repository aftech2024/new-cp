import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  fetch: "readonly",
  navigator: "readonly",
  console: "readonly",
  ScrollBehavior: "readonly",
  HTMLInputElement: "readonly",
  HTMLDivElement: "readonly",
  HTMLTextAreaElement: "readonly",
  HTMLImageElement: "readonly",
  HTMLElement: "readonly",
  File: "readonly",
  URLSearchParams: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  __BLOG_HAS_EDITIONS__: "readonly",
};

const nodeGlobals = {
  __dirname: "readonly",
  process: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  AbortController: "readonly",
  URL: "readonly",
};

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
      globals: { ...browserGlobals },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["vite.config.ts", "tailwind.config.ts", "postcss.config.js", "scripts/**/*.ts"],
    languageOptions: {
      globals: { ...nodeGlobals },
    },
  },
];
