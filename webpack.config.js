const path = require('path');

module.exports = {
    entry: './dev/js/watchfaceEditor.js',
	mode: 'none',
	// devtool: 'cheap-module-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
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
	plugins: [],
};