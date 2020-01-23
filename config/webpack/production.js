const merge = require('webpack-merge');
const common = require('./common');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader?sourceMap=true',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          sourceMap: true,
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    extractStylesPlugin,
    new Dotenv({
      silent: true, // There is not .env file in production
      systemvars: true, // Variables from CI pipeline
    }),
  ],
});
