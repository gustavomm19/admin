module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  ignorePatterns: ['**/config/*.js', '**/scripts/*.js'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
  },
};
