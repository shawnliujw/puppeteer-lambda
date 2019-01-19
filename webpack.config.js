const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    target: 'node',
    externals: [nodeExternals()],
    entry: {
        'index': './src/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        'es2017',
                        'es2016',
                        'es2015'
                    ],
                    plugins: [
                        'transform-runtime',
                    ]
                }
            }
        }]
    },
    plugins: [
    ]
}

