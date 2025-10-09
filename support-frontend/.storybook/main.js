const path = require('path');
const vite = require('vite');
const preact = require('@preact/preset-vite');
module.exports = {
	stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-storysource',
		'@storybook/addon-viewport',
		'@storybook/addon-interactions',
	],
	core: {
		builder: '@storybook/builder-vite',
	},
	framework: {
		name: '@storybook/preact-vite',
		options: {},
	},
	features: {
		interactionsDebugger: true,
	},
	staticDirs: ['./static'],
	viteFinal: async (config, { configType }) => {
		return vite.mergeConfig(config, {
			plugins: [
				preact.preact({
					reactAliasesEnabled: true,
					jsxImportSource: '@emotion/react',
				}),
			],
			resolve: {
				alias: [
					{
						find: 'components',
						replacement: path.resolve(__dirname, '../assets/components'),
					},
					{
						find: '~components',
						replacement: path.resolve(__dirname, '../assets/components'),
					},
					{
						find: 'helpers',
						replacement: path.resolve(__dirname, '../assets/helpers'),
					},
					{
						find: 'images',
						replacement: path.resolve(__dirname, '../assets/images'),
					},
					{
						find: 'pages',
						replacement: path.resolve(__dirname, '../assets/pages'),
					},
					{
						find: 'stylesheets',
						replacement: path.resolve(__dirname, '../assets/stylesheets'),
					},
					{
						find: '~stylesheets',
						replacement: path.resolve(__dirname, '../assets/stylesheets'),
					},
					{
						find: '__test-utils__',
						replacement: path.resolve(__dirname, '../assets/__test-utils__'),
					},
					{
						find: '__mocks__',
						replacement: path.resolve(__dirname, '../assets/__mocks__'),
					},
					{
						find: '@modules/internationalisation',
						replacement: path.resolve(
							__dirname,
							'../node_modules/@guardian/support-service-lambdas/modules/internationalisation/src',
						),
					},
					{
						find: '@modules',
						replacement: path.resolve(__dirname, '../../modules'),
					},
					// This is needed because the build needs the node_modules in the path
					// when sass-mq/mq is imported but storybook errors with it there, so
					// fix the storybook side with an alias.
					{
						find: 'node_modules/sass-mq/mq',
						replacement: path.resolve(__dirname, '../node_modules/sass-mq/mq'),
					},
				],
			},
		});
	},
	docs: {},
};
