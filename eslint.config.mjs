import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig({
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      plugins: { js },
      extends: ["plugin:js/recommended"],
      languageOptions: {
        globals: globals.browser,
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: "module",
          ecmaFeatures: { jsx: true }
        }
      },
      rules: {
        // aqui suas regras específicas
        "semi": ["error", "always"],
        "quotes": ["error", "single"]
      }
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
  ],
});
