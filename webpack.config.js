const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => (console.log('isProduction:', env.production) || {
  target: 'web',
  devtool: 'cheap-eval-source-map',
  entry: {
    main: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve('./dist'),
    publicPath: env.production ? '/family-feud-game/' : '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: ['node_modules'],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    // build optimization plugins
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.[hash].js',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
});
