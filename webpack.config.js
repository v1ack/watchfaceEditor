const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './dev/js/watchfaceEditor.js',
    mode: 'none',
    devtool: 'cheap-module-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
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
        })
    ]
};