const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
  target: 'web',
  devtool: 'cheap-eval-source-map',
  entry: {
    main: ['babel-polyfill', './src/index.js'],
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve('./dist'),
    publicPath: '/family-feud-game/',
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
      {
        test: /.(mp3)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
      },
      comments: false,
    }),
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
