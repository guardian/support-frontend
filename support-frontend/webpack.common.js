'use-strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { paletteAsSass } = require('./scripts/pasteup-sass');
const { getClassName } = require('./scripts/css');
const entryPoints = require('./webpack.entryPoints');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const cssLoaders = [
	{
		loader: 'postcss-loader',
		options: {
			postcssOptions: {
				plugins: [pxtorem({ propList: ['*'] }), autoprefixer()],
			},
		},
	},
	{
		loader: 'fast-sass-loader',
		options: {
			transformers: [
				{
					extensions: ['.pasteupimport'],
					transform: (rawFile) => {
						if (rawFile.includes('use palette')) {
							return paletteAsSass();
						}
						throw new Error(`Invalid .pasteupimport – ${rawFile}`);
					},
				},
			],
			includePaths: [
				path.resolve(__dirname, 'assets'),
				path.resolve(__dirname),
			],
		},
	},
];

// Hide mini-css-extract-plugin spam logs
class CleanUpStatsPlugin {
	// eslint-disable-next-line class-methods-use-this
	shouldPickStatChild(child) {
		return child.name.indexOf('mini-css-extract-plugin') !== 0;
	}

	apply(compiler) {
		compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
			const { children } = stats.compilation;
			if (Array.isArray(children)) {
				// eslint-disable-next-line no-param-reassign
				stats.compilation.children = children.filter((child) =>
					this.shouldPickStatChild(child),
				);
			}
		});
	}
}

module.exports = (cssFilename, jsFilename, minimizeCss) => ({
	plugins: [
		new WebpackManifestPlugin({
			fileName: '../../conf/assets.map',
			writeToFileEmit: true,
		}),
		...(process.env.CI_ENV === 'github'
			? [
					new BundleAnalyzerPlugin({
						reportFilename: 'webpack-stats.html',
						analyzerMode: 'static',
						openAnalyzer: false,
						logLevel: 'warn',
					}),
			  ]
			: []),
		new MiniCssExtractPlugin({
			filename: path.join('stylesheets', cssFilename),
		}),
		...(minimizeCss ? [new CssMinimizerPlugin()] : []),
		new CleanUpStatsPlugin(),
	],

	context: path.resolve(__dirname, 'assets'),

	entry: entryPoints.common,

	output: {
		globalObject: 'this',
		path: path.resolve(__dirname, 'public/compiled-assets'),
		chunkFilename: `webpack/${jsFilename}`,
		filename: `javascripts/${jsFilename}`,
		publicPath: '/assets/',
	},

	resolve: {
		alias: {
			react: 'preact/compat',
			'react-dom': 'preact/compat',
			ophan: 'ophan-tracker-js/build/ophan.support',
		},
		modules: [
			path.resolve(__dirname, 'assets'),
			path.resolve(__dirname, 'node_modules'),
			'node_modules',
		],
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: { stream: false }
	},

	module: {
		rules: [
			{
				test: /\.([jt]sx?|mjs)$/,
				exclude: {
					and: [/node_modules/],
					not: [/@guardian\/(?!(automat-modules))/],
				},
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.json',
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.(png|jpg|gif|ico)$/,
				loader: 'file-loader',
				options: {
					name: '[path][name].[hash].[ext]',
				},
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'react-svg-loader',
						options: {
							svgo: {
								plugins: [{ removeTitle: true }],
								floatPrecision: 2,
							},
							jsx: true,
						},
					},
				],
			},
			{
				test: /\.(ttf|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			},
			{
				test: /\.scss$/,
				exclude: /\.module.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
					},
					...cssLoaders,
				],
			},
			{
				test: /\.module.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								getLocalIdent: (context, localIdentName, localName) =>
									getClassName(
										path.relative(__dirname, context.resourcePath),
										localName,
									),
							},
						},
					},
					...cssLoaders,
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
					},
					...cssLoaders,
				],
			},
		],
	},
});
