module.exports = {
  ignorePatterns: ['.eslintrc.js'],
  // Specifying environments provides predefined global variables.
  env: {
      browser: true,
      es6: true,
      node: true,
      jest: true,
      amd: true // TODO: Check whether necessary
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
      ecmaVersion: 6,
      tsconfigRootDir: __dirname,
      project: 'tsconfig.json',
      sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'prettier'
  ],
  root: true,
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 1,
    'prettier/prettier': 2,
    'react/jsx-indent': [2, 'tab'],
    'react/jsx-indent-props': [2, 'tab'],
    'react/prop-types': [0],
    'react/jsx-boolean-value': [2, 'always'],
    // TODO: remove
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/no-inferrable-types': [0],
    // TODO, review these
    '@typescript-eslint/no-explicit-any': [0],
    'react/jsx-one-expression-per-line': [0],
    'react/no-array-index-key': [0],
    '@typescript-eslint/require-await': [0],
    'array-callback-return': [0],
    'consistent-return': [0],
    'default-case': [0],
    'global-require': [0],
    'import/no-extraneous-dependencies': [0],
    'no-case-declarations': [0],
    'no-empty-pattern': [0],
    'no-param-reassign': [0],
    'no-restricted-syntax': [0],
    'no-underscore-dangle': [0],
    'no-useless-escape': [0],
    'react/button-has-type': [0],
    'react/jsx-no-target-blank': [0],
    'react/sort-comp': [0],
    'react/state-in-constructor': [0],
    'react/no-danger': [0],
    'react/jsx-curly-newline': [0],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'arrow-body-style': [0],
    'react/require-default-props': [0],
    "react/jsx-uses-react": 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.prod.js'
      }
    }
  },
}
