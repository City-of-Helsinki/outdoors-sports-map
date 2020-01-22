// import path from 'path';
const path = require('path');
// import webpack from 'webpack';
// import {smart as merge} from 'webpack-merge';
const merge = require('webpack-merge');
// import CleanPlugin from 'clean-webpack-plugin';
// import common from './common';
const common = require('./common');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const context = path.resolve(__dirname, '../..');
const extractStylesPlugin = new MiniCssExtractPlugin({
  filename: '[name].[hash].css',
});

export default merge.smart(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].[hash].js',
  },
  module: {
    rules: [
      {
        // test: /\.scss$/,
        test: /\.(sa|sc|c)ss$/,
        include: path.join(context, 'src'), // FIXME?
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader?sourceMap=true',
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          // default
          // https://webpack.js.org/migrate/3/#uglifyjsplugin-warnings
          warnings: false,  // FIXME?
        },
      }),
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(['./dist'], {root: context}),
    new CleanWebpackPlugin(),
    extractStylesPlugin,
    new Dotenv({
      silent: true, // There is not .env file in production
      systemvars: true, // Variables from CI pipeline
    }),
  ],
});
