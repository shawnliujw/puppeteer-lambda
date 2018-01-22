const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    entry: {
        'src/index': './src/index.js'
    },
    output: {
        path: __dirname,
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
        // new UglifyJSPlugin()
    ]
}

