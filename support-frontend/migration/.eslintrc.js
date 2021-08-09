module.exports = {
  extends: '@guardian/eslint-config-typescript',
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      }
    }
  },
}