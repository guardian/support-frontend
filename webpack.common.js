'use-strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = (cssFilename, outputFilename, minimizeCss) => ({
  plugins: [
    new ManifestPlugin({
      fileName: '../../conf/assets.map',
      writeToFileEmit: true,
    }),
    new MiniCssExtractPlugin({
      filename: path.join('stylesheets', cssFilename),
    }),
  ],

  context: path.resolve(__dirname, 'assets'),

  entry: {
    favicons: 'images/favicons.js',
    fonts: 'fonts/fonts.js',
    styles: 'stylesheets/main.scss',
    supportLandingPage: 'pages/support-landing/supportLanding.jsx',
    subscriptionsLandingPage: 'pages/subscriptions-landing/subscriptionsLanding.jsx',
    contributionsLandingPage: 'pages/contributions-landing/contributionsLanding.jsx',
    contributionsLandingPageStyles: 'pages/contributions-landing/contributionsLanding.scss',
    regularContributionsPage: 'pages/regular-contributions/regularContributions.jsx',
    oneoffContributionsPage: 'pages/oneoff-contributions/oneoffContributions.jsx',
    regularContributionsExistingPage: 'pages/regular-contributions-existing/regularContributionsExisting.jsx',
    payPalErrorPage: 'pages/paypal-error/payPalError.jsx',
    googleTagManagerScript: 'helpers/tracking/googleTagManagerScript.js',
  },

  output: {
    path: path.resolve(__dirname, 'public/compiled-assets'),
    chunkFilename: 'webpack/[chunkhash].js',
    filename: `javascripts/${outputFilename}`,
    publicPath: '/assets/',
  },

  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      ophan: 'ophan-tracker-js/build/ophan.support',
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
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'file-loader?name=[path][name].[hash].[ext]',
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        loader: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: minimizeCss,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [pxtorem({ propList: ['*'] }), autoprefixer()],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
});
