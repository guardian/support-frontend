'use-strict';

const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {

  const plugins = [
    new ManifestPlugin({
      fileName: '../conf/assets.map',
    }),
    new ExtractTextPlugin({
      filename: getPath => getPath('javascripts/[name].[contenthash].css')
        .replace('javascripts', 'stylesheets'),
      allChunks: true,
    }),
  ];
  let devServer = {};

  if (env && env.prod) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
    plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
  } else {
    devServer = {
      proxy: {
        '**': {
          target: 'http://localhost:9000',
          secure: false,
        },
      },
    };
  }

  return {
    entry: {
      styles: 'stylesheets/main.scss',
      helloWorldPage: 'pages/hello-world/helloWorld.jsx',
      bundlesLandingPage: 'pages/bundles-landing/bundlesLanding.jsx',
    },

    output: {
      path: path.resolve(__dirname, 'public'),
      chunkFilename: 'webpack/[chunkhash].js',
      filename: 'javascripts/[name].[chunkhash].js',
      publicPath: '/assets/',
    },

    resolve: {
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      },
      modules: [
        path.resolve(__dirname, 'assets'),
        path.resolve(__dirname, 'node_modules'),
      ],
      extensions: ['.js', '.jsx'],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015'],
            cacheDirectory: '',
          },
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
        },
      ],
    },

    devtool: 'source-map',

    plugins,

    devServer,
  };
};
