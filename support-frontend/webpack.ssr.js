const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js', false), {
  mode: 'production',
  devtool: 'source-map',
  output: {
    library: ["Support", "[name]"],
    libraryTarget: "commonjs",
  }
});
