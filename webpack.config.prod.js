'use-strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    helloWorldPage: 'pages/hello-world/helloWorld.jsx',
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    chunkFilename: 'webpack/[chunkhash].js',
    filename: 'javascripts/[name].js',
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
    extensions: ['.js'],
  },

  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015'],
          cacheDirectory: '',
        },
      },
    ],
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
  ],

  devtool: 'source-map',
};
