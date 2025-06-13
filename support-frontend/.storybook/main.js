const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devConfig = require('../webpack.dev.js');
module.exports = {
	stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-storysource',
		'@storybook/addon-viewport',
		'@storybook/addon-interactions',
		'@storybook/addon-webpack5-compiler-babel',
	],
	framework: {
		name: '@storybook/preact-webpack5',
		options: {},
	},
	features: {
		interactionsDebugger: true,
	},
	staticDirs: ['./static'],
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
				alias: {
					...devConfig.resolve.alias,
					'@modules': path.resolve(__dirname, '../../modules'),
				},
				modules: devConfig.resolve.modules,
			},
		};
	},
	docs: {},
};
