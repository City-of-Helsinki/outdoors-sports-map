import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import autoprefixer from 'autoprefixer';

const context = path.resolve(__dirname, '../..');

export default {
  context: context,
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(context, 'dist'),
    publicPath: '/'
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js'],
    alias: {
      '@assets': path.join(context, 'assets')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?prefix=img/&limit=5000'
      },
      {
        test: /\.(mp3|ogg|wav)$/,
        loader: 'url-loader?prefix=audio/&limit=5000'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin([{
      from: './favicon'
    }]),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
};
