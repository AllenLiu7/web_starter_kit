import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig, // Must be last to override formatting rules

  // Global ignores
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'node_modules/**',
    'coverage/**',
    '.vitest/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    '*.config.js',
    '*.config.mjs',
  ]),

  // Custom rules
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // ===== TypeScript Best Practices =====
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // ===== Async/Promise Safety (Critical for AI Code) =====
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],

      // ===== React Best Practices =====
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js 13+
      'react/display-name': 'off',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn', // Industry standard (catches deps issues without false positive blocks)

      // ===== Import Organization =====
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'warn',
      'import/no-unused-modules': 'off',

      // ===== Code Quality =====
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',

      // ===== Logic Error Prevention (AI Code Safety) =====
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-constant-condition': 'warn',
      'no-duplicate-case': 'error',
      'no-fallthrough': 'error',
      'no-self-compare': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable': 'error',
      'no-unsafe-optional-chaining': 'error',
      'array-callback-return': 'error',
      'for-direction': 'error',
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
      'require-atomic-updates': 'error',

      // ===== Accessibility (a11y) =====
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'off',

      // ===== Next.js Specific =====
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',

      // ===== Prettier Integration =====
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
])

export default eslintConfig
