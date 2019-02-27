'use-strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { paletteAsSass } = require('./scripts/pasteup-sass');


const camelCaseToDash = str =>
  str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();


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
    subscriptionsLandingPageStyles: 'pages/subscriptions-landing/subscriptionsLanding.scss',
    newContributionsLandingPage: 'pages/new-contributions-landing/contributionsLanding.jsx',
    newContributionsLandingPageStyles: 'pages/new-contributions-landing/contributionsLanding.scss',
    digitalSubscriptionLandingPage: 'pages/digital-subscription-landing/digitalSubscriptionLanding.jsx',
    digitalSubscriptionLandingPageStyles: 'pages/digital-subscription-landing/digitalSubscriptionLanding.scss',
    digitalSubscriptionCheckoutPage: 'pages/digital-subscription-checkout/digitalSubscriptionCheckout.jsx',
    paperSubscriptionCheckoutPage: 'pages/paper-subscription-checkout/paperSubscriptionCheckout.jsx',
    digitalSubscriptionCheckoutPageThankYouExisting: 'pages/digital-subscription-checkout/thankYouExisting.jsx',
    paperSubscriptionLandingPage: 'pages/paper-subscription-landing/paperSubscriptionLandingPage.jsx',
    weeklySubscriptionLandingPage: 'pages/weekly-subscription-landing/weeklySubscriptionLanding.jsx',
    premiumTierLandingPage: 'pages/premium-tier-landing/premiumTierLanding.jsx',
    premiumTierLandingPageStyles: 'pages/premium-tier-landing/premiumTierLanding.scss',
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
              getLocalIdent: (context, localIdentName, localName) => {
                const { dir, name } = path.parse(path.relative(__dirname, context.resourcePath));
                const getStartingName = (path) => {
                  if (path === 'pages') { return null; } else if (path === 'components') { return 'component'; }
                  return path;
                };
                let identity =
                  camelCaseToDash([
                    getStartingName(dir.split(path.sep).splice(1, 1)[0]),
                    ...dir.split(path.sep).splice(2),
                    name.substr(0, name.indexOf('.')),
                  ].filter(Boolean).join('-'));

                if (localName !== 'root') {
                  identity += `__${camelCaseToDash(localName)}`;
                }
                return identity;
              },
            },
          },
          ...cssLoaders,
        ],
      },
    ],
  },
});
