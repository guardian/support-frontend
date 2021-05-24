const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const jsFileName = process.env.CI_ENV !== 'github' ? '[name].[chunkhash].js' : '[name].js';

module.exports = merge(common('[name].[chunkhash].css', jsFileName, true), {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
