import path from 'path';
import webpack from 'webpack';
import { smart as merge } from 'webpack-merge';
import CleanPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import common from './common';

const context = path.resolve(__dirname, '../..');
const extractStylesPlugin = new ExtractTextPlugin('[name].[hash].css');

export default merge({
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: extractStylesPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?sourceMap=true'),
        include: path.join(context, 'src')
      }
    ]
  },
  plugins: [
    new CleanPlugin(['./dist'], { root: context }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false }
    }),
    extractStylesPlugin
  ]
}, common);
