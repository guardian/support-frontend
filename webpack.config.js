'use-strict';

const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {

  let plugins = [];
  let devServer = {};

  if (env && env.prod) {
    plugins = [
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify('production') },
      }),
    ];
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
      extensions: ['.js', '.jsx'],
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

    plugins,

    devServer,
  };
};
