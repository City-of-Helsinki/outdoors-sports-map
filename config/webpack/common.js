const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const context = path.resolve(__dirname, '../../');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    path: path.join(context, 'dist'),
    publicPath: '/',
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js'],
    alias: {
      '@assets': path.join(context, 'assets'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre', // check files before transpiling
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader?prefix=img/&limit=5000',
          options: {
            // Resolve img src correctly
            // https://stackoverflow.com/a/59075858
            esModule: false,
          },
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/index.html',
    }),
    new CopyPlugin([{
      from: './favicon',
    }]),
  ],
};
