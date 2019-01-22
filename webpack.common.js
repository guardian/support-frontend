'use-strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (cssFilename, outputFilename, minimizeCss) => ({
  plugins: [
    new ManifestPlugin({
      fileName: '../../conf/assets.map',
      writeToFileEmit: true,
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
    fonts: 'fonts/fonts.js',
    supportLandingPage: 'pages/support-landing/supportLanding.jsx',
    showcasePage: 'pages/showcase/showcase.jsx',
    supportLandingPageStyles: 'pages/support-landing/supportLanding.scss',
    subscriptionsLandingPage: 'pages/subscriptions-landing/subscriptionsLanding.jsx',
    subscriptionsLandingPageStyles: 'pages/subscriptions-landing/subscriptionsLanding.scss',
    contributionsLandingPage: 'pages/contributions-landing/contributionsLanding.jsx',
    contributionsLandingPageStyles: 'pages/contributions-landing/contributionsLanding.scss',
    newContributionsLandingPage: 'pages/new-contributions-landing/contributionsLanding.jsx',
    newContributionsLandingPageStyles: 'pages/new-contributions-landing/contributionsLanding.scss',
    digitalSubscriptionLandingPage: 'pages/digital-subscription-landing/digitalSubscriptionLanding.jsx',
    digitalSubscriptionLandingPageStyles: 'pages/digital-subscription-landing/digitalSubscriptionLanding.scss',
    digitalSubscriptionCheckoutPage: 'pages/digital-subscription-checkout/digitalSubscriptionCheckout.jsx',
    paperSubscriptionLandingPage: 'pages/paper-subscription-landing/paperSubscriptionLandingPage.jsx',
    weeklySubscriptionLandingPage: 'pages/weekly-subscription-landing/weeklySubscriptionLanding.jsx',
    premiumTierLandingPage: 'pages/premium-tier-landing/premiumTierLanding.jsx',
    premiumTierLandingPageStyles: 'pages/premium-tier-landing/premiumTierLanding.scss',
    regularContributionsPage: 'pages/regular-contributions/regularContributions.jsx',
    regularContributionsPageStyles: 'pages/regular-contributions/regularContributions.scss',
    oneoffContributionsPage: 'pages/oneoff-contributions/oneoffContributions.jsx',
    oneoffContributionsPageStyles: 'pages/oneoff-contributions/oneoffContributions.scss',
    regularContributionsExistingPage: 'pages/regular-contributions-existing/regularContributionsExisting.jsx',
    regularContributionsExistingPageStyles: 'pages/regular-contributions-existing/regularContributionsExisting.scss',
    payPalErrorPage: 'pages/paypal-error/payPalError.jsx',
    payPalErrorPageStyles: 'pages/paypal-error/payPalError.scss',
    googleTagManagerScript: 'helpers/tracking/googleTagManagerScript.js',
    optimizeScript: 'helpers/optimize/optimizeScript.js',
    error404Page: 'pages/error/error404.jsx',
    error500Page: 'pages/error/error500.jsx',
    unsupportedBrowserStyles: 'stylesheets/fallback-pages/unsupportedBrowser.scss',
    contributionsRedirectStyles: 'stylesheets/fallback-pages/contributionsRedirect.scss',
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
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                pxtorem({ propList: ['*'] }),
                autoprefixer(),
              ],
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
