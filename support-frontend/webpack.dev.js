const webpack = require('webpack');
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
	plugins: [
		new webpack.DefinePlugin({
			'globalThis.EMOTION_RUNTIME_AUTO_LABEL': JSON.stringify(true),
		}),
	],
});
