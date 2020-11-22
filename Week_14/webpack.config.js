const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '/', dir);
}
const entrys = [
  'index',
  'demo',
]
const getEntry = (entrys) => {
  const entry = {}
  for (const name of entrys) {
    entry[name] = `./${name}.js`
    console.log(`Project is running at http://127.0.0.1:9000/${name}.html`);
  }
  return entry
}
module.exports = {
  mode: 'development',
  entry: getEntry(entrys),
  output: {
    path: resolve('./dist'),
    filename: '[name].js',
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
    ...entrys.map(name => {
      return new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: `${name}.html`,
        chunks: [`${name}`],
        inject: true,
      })
    }),
  ],
};
