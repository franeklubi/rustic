const path = require('path');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');


module.exports = {
	plugins: [
		new CleanTerminalPlugin(),
	],
	stats: 'errors-warnings',
	mode: 'development',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: [path.resolve(__dirname, 'node_modules')],
			},
		],
	},
	resolve: {
		extensions: ['.ts'],
		alias: {
			root: __dirname,
			src: path.resolve(__dirname, 'src'),
		},
	},
	output: {
		library: 'rustic',
		libraryTarget: 'umd',
		globalObject: 'this',

		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
