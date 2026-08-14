import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

/**
 * Monorepo ESLint flat config.
 * - packages/* → TypeScript recommended + layer import rules (ADR 001)
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
    '.md',
  ]),

  // packages/domain — pure domain; no adapters, framework, or web
  {
    files: ['packages/domain/**/*.{js,mjs,cjs,ts}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@toph-alert/integrations', '@toph-alert/browser-sdk'],
              message: 'Domain must not depend on adapters or browser SDK (ADR 001).',
            },
            {
              group: ['next', 'next/*', '@supabase/*'],
              message: 'Domain must not depend on framework or persistence (ADR 001).',
            },
          ],
        },
      ],
    },
  },

  // packages/integrations — HTTP adapters; domain only
  {
    files: ['packages/integrations/**/*.{js,mjs,cjs,ts}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@toph-alert/browser-sdk'],
              message: 'Integrations must not depend on browser SDK (ADR 001).',
            },
          ],
        },
      ],
    },
  },

  // packages/browser-sdk — isolated; runs in third-party storefronts
  {
    files: ['packages/browser-sdk/**/*.{js,mjs,cjs,ts}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@toph-alert/domain', '@toph-alert/integrations', '@supabase/*'],
              message: 'Browser SDK must stay isolated from server/domain/adapters (ADR 001).',
            },
          ],
        },
      ],
    },
  },

  // apps/web — Next.js; integrations only via composition root
  {
    files: ['apps/web/**/*.{js,jsx,mjs,ts,tsx}'],
    ignores: ['apps/web/lib/composition-root.ts'],
    extends: [...nextVitals, ...nextTs],
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@toph-alert/integrations'],
              message:
                'Wire @toph-alert/integrations only in apps/web/lib/composition-root.ts (ADR 001).',
            },
          ],
        },
      ],
    },
  },

  // composition root — sole wiring point (no extra restrictions)
  {
    files: ['apps/web/lib/composition-root.ts'],
    extends: [...nextVitals, ...nextTs],
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
    },
  },

  eslintConfigPrettier,
]);
