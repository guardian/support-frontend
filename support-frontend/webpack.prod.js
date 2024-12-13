const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (
	env = {
		ci: 'teamcity',
	},
) => {
	const { ci } = env;
	const isGithubAction = ci === 'github';
	const jsFileName = isGithubAction ? '[name].js' : '[name].[chunkhash].js';

	return merge(common('[name].[chunkhash].css', jsFileName, true), {
		mode: 'production',
		devtool: 'source-map',
		plugins: [
			...(isGithubAction
				? [
						new BundleAnalyzerPlugin({
							reportFilename: 'webpack-stats.html',
							analyzerMode: 'static',
							openAnalyzer: false,
							logLevel: 'warn',
						}),
				  ]
				: []),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
		],
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
};
