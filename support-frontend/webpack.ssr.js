const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js', false,
  [{
    test: /(showcase.jsx|paperSubscriptionLandingPage.jsx)/,
    use: 'exports-loader?getHtml,content'
  }]), {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
