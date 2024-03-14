const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js', false), {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		port: 9211,
		allowedHosts: 'all',
	},
	resolve: {
		fallback: { crypto: false },
	},
});
