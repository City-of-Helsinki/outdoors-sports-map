const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const common = require('./common.js');
const postcssPresetEnv = require('postcss-preset-env');

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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                postcssPresetEnv({
                  // Consider using `browserslist`
                  browsers: 'last 2 versions',
                }),
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