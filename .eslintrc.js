module.exports = {
  extends: ['eslint:recommended'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  root: true,

  plugins: ['import'],

  rules: {},
};
