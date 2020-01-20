module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  root: true,

  plugins: ['import', 'react', '@typescript-eslint'],

  rules: { 'no-unused-vars': 0 }
};
