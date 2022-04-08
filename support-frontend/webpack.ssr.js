const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const entryPoints = require('./webpack.entryPoints');

module.exports = merge(common('[name].css', '[name].js', false), {
	mode: 'development',
	entry: entryPoints.ssr,
	output: {
		library: ['Support', '[name]'],
		libraryTarget: 'commonjs',
	},
});
