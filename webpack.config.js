const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './dev/js/watchfaceEditor.js',
    mode: 'none',
    devtool: 'cheap-module-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        compress: false,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: [".js", ".jsx"]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'static' }
            ]
        }),
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': JSON.stringify('development')
			})
    ]
};