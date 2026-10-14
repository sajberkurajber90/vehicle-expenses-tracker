import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/node_modules'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['apps/api-core/**/*.ts'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'import/no-cycle': ['error', { maxDepth: 1 }],
    },
  },
  tseslint.configs.recommended,
]);
