const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfiguration = require('../webpack.config');
const environment = require('./environment');

module.exports = merge(webpackConfiguration, {
	mode: 'development',

	/* Manage source maps generation process */
	devtool: 'source-map',

	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: true,
							modules: false,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		]
	},

	/* Development Server Configuration */
	devServer: {
		static: {
			directory: environment.paths.output,
			publicPath: '/',
			watch: true,
		},
		client: {
			overlay: {
				warnings: true,
				errors: true,
			},
		},
		// open: true,
		compress: true,
		hot: false,
		...environment.server,
	},

	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: '[file].map',
		}),
	],
	optimization: {
		// Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
		// instead of having their own. This also helps with long-term caching, since the chunks will only
		// change when actual code changes, not the webpack runtime.
		runtimeChunk: {
			name: 'runtime',
		},
	},

	/* File watcher options */
	watchOptions: {
		aggregateTimeout: 300,
		poll: 300,
		ignored: /node_modules/,
	},
});
