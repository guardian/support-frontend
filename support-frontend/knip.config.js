const entryPoints = require('../webpack.entryPoints').common;

const flattenedEntryPoints = [...Object.keys(entryPoints)].map(
	(key) => `assets/${entryPoints[key]}!`,
);

module.exports = {
	// ! signals that this is production code https://knip.dev/features/production-mode
	entry: [...flattenedEntryPoints, 'scripts/build-ssr-content.tsx!'],
	project: ['**/*.{js,jsx,ts,tsx,scss}!'],
	ignoreExportsUsedInFile: false,
	ignore: ['**/knip.*.js'],
	ignoreDependencies: [
		// used in package.json
		'@guardian/browserslist-config',
		// knip has trouble telling that this is used
		'@guardian/support-service-lambdas',
		'lint-staged',
		// used by scripts in package.json
		'webpack-cli',
		'webpack-dev-server',
		// could be used to run Chromatic locally
		'chromatic',
		'concurrently', // used in devrun.sh
		// used in webpack.common.js
		'babel-loader',
		'css-loader',
		'fast-sass-loader',
		'file-loader',
		'postcss-loader',
		'ts-loader',
		'sass', // peer dependency of fast-sass-loader
		'sass-mq', // imported from breakpoints.scss
		'@babel/runtime', // required by the build (errors without it)
		// This is needed by storybook (specifically by @storybook/builder-vite)
		'@storybook/preact',
	],
	webpack: {
		entry: ['webpack.*.js'],
	},
};
