const defaultConfig = {...require('../webpack.dev.js')};

defaultConfig.module.rules.push({
  test: /stories\/.*?\.(js|jsx)$/,
  loaders: [
    {
      loader: require.resolve('@storybook/addon-storysource/loader'),
      options: { 
        injectDecorator: true,
        parser: 'typescript' 
        // we use flow but flow is closer to ts than vanilla js
      }
    }
  ],
  enforce: 'pre',
});

module.exports = defaultConfig;
