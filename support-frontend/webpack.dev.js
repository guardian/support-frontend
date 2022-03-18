const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js', false), {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		disableHostCheck: true,
		proxy: {
			'**': {
				target: 'http://support.thegulocal.com:9210',
				secure: false,
			},
		},
	},
});
