'use-strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const { paletteAsSass } = require('./scripts/pasteup-sass');
const { getClassName } = require('./scripts/css');

const cssLoaders = [{
  loader: 'postcss-loader',
  options: {
    plugins: [
      pxtorem({ propList: ['*'] }),
      autoprefixer(),
    ],
  },
},
{
  loader: 'fast-sass-loader',
  options: {
    transformers: [
      {
        extensions: ['.pasteupimport'],
        transform: (rawFile) => {
          if (rawFile.includes('use palette')) {
            return paletteAsSass();
          }
          throw new Error(`Invalid .pasteupimport – ${rawFile}`);
        },
      },
    ],
    includePaths: [
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname),
    ],
  },
}];

module.exports = (cssFilename, outputFilename, minimizeCss) => ({
  plugins: [
    new ManifestPlugin({
      fileName: '../../conf/assets.map',
      writeToFileEmit: true,
    }),
    new StatsWriterPlugin({
      filename: 'stats.json',
      fields: null,
    }),
    new MiniCssExtractPlugin({
      filename: path.join('stylesheets', cssFilename),
    }),
    ...(minimizeCss ? [new OptimizeCssAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: 'default',
      },
      canPrint: true,
    })] : []),
  ],

  context: path.resolve(__dirname, 'assets'),

  entry: {
    favicons: 'images/favicons.js',
    showcasePage: 'pages/showcase/showcase.jsx',
    subscriptionsLandingPage: 'pages/subscriptions-landing/subscriptionsLanding.jsx',
    contributionsLandingPage: 'pages/contributions-landing/contributionsLanding.jsx',
    fontLoader: 'helpers/fontLoader.js',

    digitalSubscriptionLandingPage: 'pages/digital-subscription-landing/digitalSubscriptionLanding.jsx',
    digitalSubscriptionCheckoutPage: 'pages/digital-subscription-checkout/digitalSubscriptionCheckout.jsx',
    digitalSubscriptionCheckoutPageThankYouExisting: 'pages/digital-subscription-checkout/thankYouExisting.jsx',

    paperSubscriptionLandingPage: 'pages/paper-subscription-landing/paperSubscriptionLandingPage.jsx',
    paperSubscriptionCheckoutPage: 'pages/paper-subscription-checkout/paperSubscriptionCheckout.jsx',

    weeklySubscriptionLandingPage: 'pages/weekly-subscription-landing/weeklySubscriptionLanding.jsx',
    weeklySubscriptionCheckoutPage: 'pages/weekly-subscription-checkout/weeklySubscriptionCheckout.jsx',

    payPalErrorPage: 'pages/paypal-error/payPalError.jsx',
    payPalErrorPageStyles: 'pages/paypal-error/payPalError.scss',
    googleTagManagerScript: 'helpers/tracking/googleTagManagerScript.js',
    error404Page: 'pages/error/error404.jsx',
    error500Page: 'pages/error/error500.jsx',
    unsupportedBrowserStyles: 'stylesheets/fallback-pages/unsupportedBrowser.scss',
    contributionsRedirectStyles: 'stylesheets/fallback-pages/contributionsRedirect.scss',
    promotionTerms: 'pages/promotion-terms/promotionTerms.jsx',
  },

  output: {
    path: path.resolve(__dirname, 'public/compiled-assets'),
    chunkFilename: 'webpack/[chunkhash].js',
    filename: `javascripts/${outputFilename}`,
    publicPath: '/assets/',
  },

  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
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
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              svgo: {
                plugins: [
                  { removeTitle: true },
                ],
                floatPrecision: 2,
              },
              jsx: true,
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        loader: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.scss$/,
        exclude: /\.module.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          ...cssLoaders,
        ],
      },
      {
        test: /\.module.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => getClassName(
                path.relative(__dirname, context.resourcePath),
                localName,
              ),
            },
          },
          ...cssLoaders,
        ],
      },
    ],
  },
});
