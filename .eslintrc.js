module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: 'babel-eslint',
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

  plugins: ['import', 'react'],

  rules: { 'no-unused-vars': 0 }
};
