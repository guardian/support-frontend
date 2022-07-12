const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devConfig = require('../webpack.dev.js');

module.exports = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
		'@storybook/addon-a11y',
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    "@storybook/addon-viewport",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    "builder": "@storybook/builder-webpack5"
  },
	features: {
    interactionsDebugger: true,
  },
	webpackFinal: async (config) => {
    return {
			...config,
			plugins: [
				...config.plugins,
				new MiniCssExtractPlugin({
					filename: path.join('stylesheets', 'style.css'),
				}),
			],
			module: {
				...config.module,
				rules: devConfig.module.rules,
			},
			resolve: {
				...config.resolve,
				alias: devConfig.resolve.alias,
				modules: devConfig.resolve.modules,
			}
		};
  },
}