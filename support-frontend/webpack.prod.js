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
	});
};
