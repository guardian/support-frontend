const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js'), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    proxy: {
      '**': {
        target: 'http://support.thegulocal.com:9210',
        secure: false,
      },
    },
  },
});
