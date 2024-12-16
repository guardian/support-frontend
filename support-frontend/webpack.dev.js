const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js', false), {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		allowedHosts: 'all',
		proxy: [
			{
				context: ['**'],
				target: 'http://support.thegulocal.com:9210',
				secure: false,
			},
		],
		client: {
			webSocketURL: 'https://support.thegulocal.com/ws',
			overlay: false,
		},
	},
	resolve: {
		fallback: { crypto: false },
	},
	// See https://webpack.js.org/configuration/optimization/
	// optimization: {
	// 	splitChunks: {
	// 		chunks() {
	// 			return false;
	// 		},
	// 	},
	// },
});
