const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('babel-polyfill');

const isProduction = process.env.NODE_ENV === 'production';
const environment = require('./settings/environment');

const currentOutput = isProduction ? environment.paths.build : environment.paths.output;

const PAGES_DIR = `${path.resolve(environment.paths.source)}/pug/pages/`;
const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter((fileName) => fileName.endsWith('.pug'));

const htmlPluginEntries = PAGES.map(
	(page) => new HTMLWebpackPlugin({
		template: `${PAGES_DIR}/${page}`,
		filename: `./${page.replace(/\.pug/, '.html')}`,
		environment: process.env.NODE_ENV,
		minify: false,
		inject: 'body',
	}),
);

module.exports = {
	entry: {
		// 'es6-promise': ['core-js/modules/es6.promise'],
		// 'es6-array-iterator': ['core-js/modules/es6.array.iterator'],
		// 'babel-polyfill': ['babel-polyfill'],
		app: path.resolve(environment.paths.source, 'index.js'),
	},
	resolve: {
		extensions: ['.ts', '.js', '*'],
		modules: [path.resolve(environment.paths.source, 'js'), 'node_modules'],
	},
	output: {
		filename: 'js/[name].js',
		path: currentOutput,
		// assetModuleFilename: 'images/[name][ext]',
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				oneOf: [
					// this applies to <template lang="pug"> in Vue components
					// {
					//   resourceQuery: /^\?vue/,
					//   use: ['pug-plain-loader'],
					// },

					// this applies to pug imports inside JavaScript
					{
						use: ['pug-loader?pretty=true'],
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader?cacheDirectory'],
			},
			{
				test: /\.(png|gif|webp|jpe?g|svg)$/i,
				type: 'asset',
				exclude: path.resolve(
					environment.paths.source,
					'images',
					'icons',
					'sprite_icons',
				),
				parser: {
					dataUrlCondition: {
						maxSize: environment.limits.images,
					},
				},
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.svg$/,
				include: path.resolve(
					environment.paths.source,
					'images',
					'icons',
					'sprite_icons',
				),
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							extract: true,
							publicPath: '/images/sprite/',
						},
					},
					{
						loader: 'svgo-loader',
					},
				],
			},
			{
				test: /\.(eot|ttf|woff|woff2)$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: environment.limits.images,
					},
				},
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			PAGES: JSON.stringify(PAGES),
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.$': 'jquery',
			'window.jQuery': 'jquery',
		}),
		new CleanWebpackPlugin({
			verbose: false,
			cleanStaleWebpackAssets: false,
			cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
		}),
		new SpriteLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(environment.paths.source, 'images'),
					to: path.resolve(currentOutput, 'images'),
					toType: 'dir',
					noErrorOnMissing: true,
					globOptions: {
						dot: true,
						ignore: [
							'**/icons/other_icons/**',
							'**/icons/sprite_icons/**',
						],
					},
				},
				{
					from: path.resolve(environment.paths.source, 'static'),
					to: path.resolve(currentOutput),
					toType: 'dir',
					noErrorOnMissing: true,
					globOptions: {
						dot: true,
						// gitignore: true,
						ignore: ['**/.gitkeep'],
					},
				},
			],
		}),
		new ESLintPlugin(),
	].concat(htmlPluginEntries),
	target: 'web',
};
