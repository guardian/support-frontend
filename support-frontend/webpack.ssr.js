const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].css', '[name].js', false), {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    ssrPages: 'helpers/ssrPages.js',
  },
  output: {
    library: ['Support', '[name]'],
    libraryTarget: 'commonjs',
  },
});
