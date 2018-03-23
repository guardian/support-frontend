const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common('[name].[chunkhash].css', '[name].[chunkhash].js'), {
  mode: 'production',
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': { NODE_ENV: JSON.stringify('production') }
    //   }),
  ],
});
