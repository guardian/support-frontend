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
      fileName: '../../conf/assets.map',
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
    const uglifyOpts = { compress: { warnings: false }, sourceMap: true };
    plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOpts));

    const defineOpts = { 'process.env': { NODE_ENV: JSON.stringify('production') } };
    plugins.push(new webpack.DefinePlugin(defineOpts));
  } else {
    devServer = {
      proxy: {
        '**': {
          target: 'http://support.thegulocal.com:9210',
          secure: false,
        },
      },
    };
  }

  return {
    context: path.resolve(__dirname, 'assets'),

    entry: {
      favicons: 'images/favicons.js',
      styles: 'stylesheets/garnett.scss',
      supportLandingPage: 'pages/support-landing/supportLanding.jsx',
      bundlesLandingPage: 'pages/bundles-landing/bundlesLanding.jsx',
      supportLandingPageOld: 'pages/bundles-landing/support-landing-ab-test/supportLandingOld.jsx',
      contributionsLandingPageUK: 'pages/contributions-landing-uk/contributionsLandingUK.jsx',
      contributionsLandingPageUS: 'pages/contributions-landing-us/contributionsLandingUS.jsx',
      contributionsLandingPageAU: 'pages/contributions-landing/contributionsLandingAU.jsx',
      contributionsLandingPageEU: 'pages/contributions-landing-eu/contributionsLandingEU.jsx',
      regularContributionsPage: 'pages/regular-contributions/regularContributions.jsx',
      regularContributionsThankYouPage: 'pages/regular-contributions-thank-you/regularContributionsThankYou.jsx',
      oneoffContributionsPage: 'pages/oneoff-contributions/oneoffContributions.jsx',
      oneoffContributionsThankyouPage: 'pages/contributions-thankyou/oneoffContributionsThankyou.jsx',
      contributionsThankYouPage: 'pages/contributions-thank-you/contributionsThankYou.jsx',
      regularContributionsExistingPage: 'pages/regular-contributions-existing/regularContributionsExisting.jsx',
      payPalErrorPage: 'pages/paypal-error/payPalError.jsx',
      googleTagManagerScript: 'helpers/tracking/googleTagManagerScript.js',
    },

    output: {
      path: path.resolve(__dirname, 'public/compiled-assets'),
      chunkFilename: 'webpack/[chunkhash].js',
      filename: `javascripts/[name]${isProd ? '.[chunkhash]' : ''}.js`,
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
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isProd,
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
          }),
        },
      ],
    },

    devtool: 'source-map',

    plugins,

    devServer,
  };
};
