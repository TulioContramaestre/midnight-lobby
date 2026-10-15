import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const noReact = {
  group: ['react', 'react/**', 'react-dom', 'react-dom/**', '@tabler/**'],
  message: 'Keep this layer free of React.',
}
const noUi = {
  group: ['@/ui/**', '@/app/**', '**/ui/**', '**/app/**'],
  message: 'Do not import UI code here.',
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/engine/**/*.ts'],
    ignores: ['src/engine/__tests__/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            noReact,
            noUi,
            {
              group: ['@/content/**', '**/content/**'],
              allowTypeImports: true,
              message: 'The engine only imports content types; content is passed in.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/engine/__tests__/**/*.ts', 'src/content/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': ['error', { patterns: [noReact, noUi] }],
    },
  },
])
