module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    'import',
    'react',
    '@typescript-eslint',
  ],
  rules: {
    "@typescript-eslint/indent": ["error", 4],
    "react/display-name": ["off"],
  },
  settings: {
    react: {
      version: 'detect',
    }
  }
};
