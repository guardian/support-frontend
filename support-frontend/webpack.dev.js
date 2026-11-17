const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// Dev bundles share file names with prod, so clear any stale SRI hashes
class ClearIntegrityManifestPlugin {
	apply(compiler) {
		const clear = () =>
			fs.rmSync(path.resolve(__dirname, 'conf/assets-integrity.json'), {
				force: true,
			});
		compiler.hooks.beforeRun.tap('ClearIntegrityManifestPlugin', clear);
		compiler.hooks.watchRun.tap('ClearIntegrityManifestPlugin', clear);
	}
}

// Routes to be handled by the new backend
const expressRoutePrefixes = [
	'/healthcheck-express',
	'/api/postcode-lookup/',
	'/api/delivery-agents/',
];

module.exports = merge(common('[name].js'), {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		allowedHosts: 'all',
		proxy: [
			{
				context: (pathname) => {
					return expressRoutePrefixes.some((prefix) =>
						pathname.startsWith(prefix),
					);
				},
				target: 'http://support.thegulocal.com:3000',
				secure: false,
			},
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
		new ClearIntegrityManifestPlugin(),
		new webpack.DefinePlugin({
			'globalThis.EMOTION_RUNTIME_AUTO_LABEL': JSON.stringify(true),
		}),
	],
});
