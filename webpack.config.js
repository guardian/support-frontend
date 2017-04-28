'use-strict';

const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = (env) => {

  const isProd = env && env.prod;

  const plugins = [
    new ManifestPlugin({
      fileName: '../conf/assets.map',
      writeToFileEmit: true,
    }),
    new ExtractTextPlugin({
      filename: getPath => getPath(`javascripts/[name]${isProd ? '.[contenthash]' : ''}.css`)
        .replace('javascripts', 'stylesheets'),
      allChunks: true,
    }),
  ];
  let devServer = {};

  if (isProd) {
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
      filename: `javascripts/[name]${isProd ? '.[chunkhash]' : ''}.js`,
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
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [pxtorem(), autoprefixer()],
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          }),
        },
      ],
    },

    devtool: 'source-map',

    plugins,

    devServer,
  };
};
