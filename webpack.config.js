'use-strict';

const path = require('path');

module.exports = {
  entry: {
    helloWorldPage: 'pages/hello-world/helloWorld.jsx',
    bundlesLandingPage: 'pages/bundles-landing/bundlesLanding.jsx',
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

  devtool: 'source-map',

  devServer: {
    proxy: {
      '**': {
        target: 'http://localhost:9000',
        secure: false,
      },
    },
  },
};
