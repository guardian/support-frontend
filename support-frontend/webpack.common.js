'use-strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pxtorem = require('postcss-pxtorem');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { getClassName } = require('./scripts/css');
const { paletteAsSass } = require('./scripts/pasteup-sass');
const entryPoints = require('./webpack.entryPoints');

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
			includePaths: [
				path.resolve(__dirname, 'assets'),
				path.resolve(__dirname),
			],
		},
	},
];

// Hide mini-css-extract-plugin spam logs
class CleanUpStatsPlugin {
	shouldPickStatChild(child) {
		return child.name.indexOf('mini-css-extract-plugin') !== 0;
	}

	apply(compiler) {
		compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
			const { children } = stats.compilation;
			if (Array.isArray(children)) {
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
			fileName: '../../conf/assets.json',
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
			'@modules/internationalisation': path.resolve(
				__dirname,
				'./node_modules/@guardian/support-service-lambdas/modules/internationalisation/src',
			),
			'@modules/product-catalog': path.resolve(
				__dirname,
				'./node_modules/@guardian/support-service-lambdas/modules/product-catalog/src',
			),
			'@modules/arrayFunctions': path.resolve(
				__dirname,
				'./node_modules/@guardian/support-service-lambdas/modules/arrayFunctions',
			),
			'@modules/objectFunctions': path.resolve(
				__dirname,
				'./node_modules/@guardian/support-service-lambdas/modules/objectFunctions',
			),
			'@modules': path.resolve(__dirname, '../modules'),
		},
		modules: [
			path.resolve(__dirname, 'assets'),
			path.resolve(__dirname, 'node_modules'),
			'node_modules',
		],
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},

	module: {
		rules: [
			{
				test: /\.([jt]sx?|mjs)$/,
				exclude: {
					and: [/node_modules/],
					not: [
						/@guardian\/libs/,
						// we need to include this here to support Safari < v14 as @guardian/source doesn't ship compiled,
						// so we need our Babel to make it compatible with things like public class fields
						/@guardian\/source/,
						/@guardian\/source-development-kitchen/,
						/@guardian\/support-service-lambdas/,
					],
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
