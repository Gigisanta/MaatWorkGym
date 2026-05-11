import nextPlugin from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const a11yRules = Object.fromEntries(
  Object.entries(jsxA11y.configs.recommended.rules || {}).map(([key, value]) => [
    key,
    ["warn"],
  ])
);

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", "coverage/**", "dist/**", "scripts/**", "prisma/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tseslint,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      ...a11yRules,
    },
  },
];

export default eslintConfig;