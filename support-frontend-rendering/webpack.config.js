/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = function (env) {
    // default to the server configuration
    const base = {
        mode: process.env.NODE_ENV,
        entry: './src/server/index.tsx',
        output: {
            filename: 'js/server.js',
            // path needs to be an ABSOLUTE file path
            path: path.resolve(process.cwd(), 'dist'),
            publicPath: '/',
        },
        resolve: {
            alias: {
                react: 'preact/compat',
                'react-dom': 'preact/compat',
            },
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                },
            ],
        },
    };

    // server-specific configuration
    if (env.platform === 'server') {
        base.target = 'node';
    }

    // client-specific configurations
    if (env.platform === 'web') {
        base.entry = './src/clientEntry.tsx';
        base.output.filename = 'js/client.js';
        base.plugins = [new CompressionPlugin()];
    }

    return base;
};
