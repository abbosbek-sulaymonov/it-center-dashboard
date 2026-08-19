import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

/**
 * Flat ESLint config.
 *
 * Three environments live in this repo and each gets its own block:
 *   - browser code under `src/`
 *   - Node code under `server/` and `api/`
 *   - config files at the repo root
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.vercel/**'],
  },

  js.configs.recommended,

  // Shared rules for every file we own.
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'multi-line'],
    },
  },

  // Browser / React.
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
    },
  },

  // Node / Express.
  {
    files: ['server/**/*.js', 'api/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },

  /**
   * Fetch-on-mount is exactly the "synchronize with an external system" case
   * effects exist for, and these three modules are the only place the project
   * does it — every screen goes through them rather than calling the API in an
   * effect of its own. The rule's cascading-render warning does not apply.
   */
  {
    files: [
      'src/hooks/useApiResource.js',
      'src/context/AuthContext.jsx',
      'src/components/common/SearchInput.jsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },

  // Root-level tooling config.
  {
    files: ['*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Keep formatting decisions in Prettier's hands. Must stay last.
  prettier,
];
