/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackConfiguration = require('../webpack.config');
const environment = require('./environment');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(webpackConfiguration, {
	mode: 'production',

	/* Manage source maps generation process. Refer to https://webpack.js.org/configuration/devtool/#production */
	devtool: false,

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
							sourceMap: false,
							modules: false,
						},
					},
					'postcss-loader',
					'sass-loader',
				],
			},
		],
	},

	/* Additional plugins configuration */
	plugins: [
		new CleanWebpackPlugin({
			verbose: true,
			cleanOnceBeforeBuildPatterns: [
				path.resolve(environment.paths.wpOutput, 'assets', 'static'),
				path.resolve(environment.paths.wpOutput, 'assets', 'images'),
				path.resolve(environment.paths.wpOutput, 'js'),
				path.resolve(environment.paths.wpOutput, 'styles'),
				path.resolve(environment.paths.wpOutput, 'fonts'),
			],
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(environment.paths.build, 'images', 'sprite'),
					to: path.resolve(environment.paths.wpOutput, 'images', 'sprite'),
					noErrorOnMissing: true,
				},
				{
					from: path.resolve(environment.paths.source, 'static'),
					to: path.resolve(environment.paths.wpOutput, 'assets', 'static'),
					toType: 'dir',
					noErrorOnMissing: true,
					globOptions: {
						dot: true,
						// gitignore: true,
						ignore: ['**/.gitkeep'],
					},
				},
				{
					from: path.resolve(environment.paths.build, 'js'),
					to: path.resolve(environment.paths.wpOutput, 'js'),
					noErrorOnMissing: true,
				},
				{
					from: path.resolve(environment.paths.build, 'css'),
					to: path.resolve(environment.paths.wpOutput, 'styles'),
					noErrorOnMissing: true,
				},
				{
					from: path.resolve(environment.paths.build, 'fonts'),
					to: path.resolve(environment.paths.wpOutput, 'fonts'),
					noErrorOnMissing: true,
				},
			],
		}),
	],
});
