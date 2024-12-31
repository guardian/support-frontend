const entryPoints = require('../webpack.entryPoints').common;

const flattenedEntryPoints = [...Object.keys(entryPoints)].map(
	(key) => `assets/${entryPoints[key]}`,
);

module.exports = {
	entry: flattenedEntryPoints,
	project: ['**/*.{js,jsx,ts,tsx,scss}!'],
	ignoreExportsUsedInFile: true,
	ignoreDependencies: [
		// used in package.json
		'@guardian/browserslist-config',
		'lint-staged',
		// used by scripts in package.json
		'webpack-cli',
		'webpack-dev-server',
		// necessary for chromatic to work
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
	],
	webpack: {
		entry: ['webpack.*.js'],
	},
};
