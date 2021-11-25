const defaultConfig = {...require('../webpack.dev.js')};

defaultConfig.module.rules.push({
  test: /stories\/.*?\.(js|jsx|ts|tsx)$/,
  loaders: [
    {
      loader: require.resolve('@storybook/addon-storysource/loader'),
      options: {
        injectDecorator: true,
        parser: 'typescript'
      }
    }
  ],
  enforce: 'pre',
});

module.exports = defaultConfig;
