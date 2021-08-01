const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
	stats: 'errors-warnings',
	mode: 'development',
	devtool: 'source-map',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: [path.resolve(__dirname, 'src')],
				exclude: [path.resolve(__dirname, 'node_modules')],
				loader: require.resolve('ts-loader'),
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
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: true,
				},
			}),
		],
	},
};
