/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

require('../src/server');

const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  build: path.resolve(__dirname, '../build'),
};

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.WS_PORT': process.env.WS_PORT,
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
  new HtmlWebpackPlugin({
    inject: true,
    minify: {
      preserveLineBreaks: true,
      collapseWhitespace: true,
    },
    template: 'src/client/index.pug',
    filename: 'index.html',
  }),
];

const rules = [
  {
    enforce: 'pre',
    test: /(\.js|\.jsx)$/,
    loaders: ['eslint'],
    include: [PATHS.app],
  },
  {
    test: /\.(s[a|c]ss|css)$/,
    use: [
      'style',
      {
        loader: 'css',
        query: {
          sourceMap: true,
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]-[local]___[hash:base64:5]',
        },
      },
      'sass',
    ],
  },
  {
    test: /(\.js|\.jsx)$/,
    include: [
      PATHS.app,
    ],
    use: [
      'babel',
    ],
  },
  {
    test: /\.pug$/,
    loader: 'pug',
  },
];

module.exports = {
  entry: {
    app: path.resolve(PATHS.app, 'index.jsx'),
    vendor: ['react'],
  },
  output: {
    path: PATHS.build,
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  stats: {
    colors: true,
    reasons: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  module: { rules },
  plugins,
  devServer: {
    contentBase: PATHS.app,
    port: 3000,
    historyApiFallback: true,
  },
  devtool: 'source-map',
};
