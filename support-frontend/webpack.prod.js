const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const common = require('./webpack.common.js');

// Writes a map of public asset path -> SRI hash, read by AssetsResolver
class IntegrityManifestPlugin {
	apply(compiler) {
		compiler.hooks.done.tap('IntegrityManifestPlugin', (stats) => {
			const manifest = {};
			stats.compilation.getAssets().forEach(({ name, info }) => {
				const hashes = [].concat(info.contenthash ?? []);
				const integrity = hashes.find((h) => h.startsWith('sha384-'));
				if (name.endsWith('.js') && integrity) {
					manifest[`/assets/${name}`] = integrity;
				}
			});
			fs.writeFileSync(
				path.resolve(__dirname, 'conf/assets-integrity.json'),
				JSON.stringify(manifest, null, 2),
			);
		});
	}
}

module.exports = (
	env = {
		ci: 'teamcity',
	},
) => {
	const { ci } = env;
	const isGithubAction = ci === 'github';
	const jsFileName = isGithubAction ? '[name].js' : '[name].[chunkhash].js';

	return merge(common(jsFileName), {
		mode: 'production',
		devtool: 'source-map',
		output: {
			crossOriginLoading: 'anonymous',
		},
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
			new SubresourceIntegrityPlugin(),
			new IntegrityManifestPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
		],
	});
};
