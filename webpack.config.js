var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        helloWorldPage: 'pages/hello-world/helloWorld.js'
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        chunkFilename: 'webpack/[chunkhash].js',
        filename: "javascripts/[name].js",
        publicPath: '/assets/'
    },

    resolve: {
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        },
        modules: [
            path.resolve(__dirname, "assets"),
            path.resolve(__dirname, "node_modules")
        ],
        extensions: [".js"]
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015'],
                    cacheDirectory: ''
                }
            }
        ]
    },

    devtool: 'source-map',

    devServer: {
        proxy: {
            '**': {
                target: 'http://localhost:9000',
                secure: false
            }
        }
    }
};