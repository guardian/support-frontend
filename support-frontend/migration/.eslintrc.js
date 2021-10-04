module.exports = {
  extends: '@guardian/eslint-config-typescript',
  rules: {
    // TODO: update this to 'warn' or delete once the post-migration fixing process is done
    "import/no-default-export": "off",
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      }
    }
  },
}
