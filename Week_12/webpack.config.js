const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '/', dir);
}
module.exports = {
  mode: 'development',
  entry: './main.js',
  output: {
    path: resolve('./dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: path.posix.join('./', 'index.html') }],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: '127.0.0.1',
    port: 9000,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    },
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('./img'),
          to: 'img',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
  ],
};
