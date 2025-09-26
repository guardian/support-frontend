const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devConfig = require('../webpack.dev.js');
// const { plugin } = require('postcss');
import react from '@vitejs/plugin-react';

module.exports = {
	stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest',
	],
	framework: {
		name: '@storybook/preact-vite',
		options: {},
	},
	core: {
		builder: '@storybook/builder-vite',
	},
	features: {
		interactionsDebugger: true,
	},
	staticDirs: ['./static'],
	viteFinal: async (config) => {
		return {
			...config,
			resolve: {
				...config.resolve,
				alias: {
					...devConfig.resolve.alias,
					'~stylesheets': path.resolve(__dirname, '../assets/stylesheets'),
					stylesheets: path.resolve(__dirname, '../assets/stylesheets'),
					'__test-utils__': path.resolve(__dirname, '../assets/__test-utils__'),
					__mocks__: path.resolve(__dirname, '../assets/__mocks__'),
					'@modules/internationalisation': path.resolve(
						__dirname,
						'../node_modules/@guardian/support-service-lambdas/modules/internationalisation/src',
					),
					'@modules': path.resolve(__dirname, '../../modules'),
					ophan: path.resolve(
						__dirname,
						'../node_modules/ophan-tracker-js/build/ophan.support',
					),
					components: path.resolve(__dirname, '../assets/components'),
					'~components': path.resolve(__dirname, '../assets/components'),
					helpers: path.resolve(__dirname, '../assets/helpers'),
					pages: path.resolve(__dirname, '../assets/pages'),
				},
				modules: devConfig.resolve.modules,
			},
			plugins: [
				react({
					jsxRuntime: 'automatic',
				}),
			],
		};
	},
	docs: {},
};
