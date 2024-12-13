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
	optimization: {
		splitChunks: {
			chunks() {
				return false;
			},
		},
	},
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'initial',
	// 		minSize: 20000,
	// 		minRemainingSize: 0,
	// 		minChunks: 1,
	// 		maxAsyncRequests: 30,
	// 		maxInitialRequests: 30,
	// 		enforceSizeThreshold: 50000,
	// 		cacheGroups: {
	// 			defaultVendors: {
	// 				test: /[\\/]node_modules[\\/]/,
	// 				priority: -10,
	// 				reuseExistingChunk: true,
	// 			},
	// 			default: {
	// 				minChunks: 2,
	// 				priority: -20,
	// 				reuseExistingChunk: true,
	// 			},
	// 		},
	// 	},
	// },
});
