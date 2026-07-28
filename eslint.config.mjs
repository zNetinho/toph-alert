import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

/**
 * Monorepo ESLint flat config.
 * - packages/* → TypeScript recommended
 * - apps/web → Next.js core-web-vitals + typescript (scoped)
 */
export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/build/**',
    '**/.next/**',
    '**/out/**',
    'docs/**',
    '.spec/**',
    '.cursor/**',
    'apps/web/next-env.d.ts',
  ]),

  // packages/* (domain, browser-sdk, integrations)
  {
    files: ['packages/**/*.{js,mjs,cjs,ts}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  },

  // apps/web — Next.js (same stack as apps/web/eslint.config.mjs)
  {
    files: ['apps/web/**/*.{js,jsx,mjs,ts,tsx}'],
    extends: [...nextVitals, ...nextTs],
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
    },
  },

  eslintConfigPrettier,
]);
