const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge.smart(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].js',
  },
  devServer: {
    host: '0.0.0.0',  // for Docker
    port: 5000,
    hot: true,
    inline: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: true, // Variables from npm scripts
    }),
  ],
});