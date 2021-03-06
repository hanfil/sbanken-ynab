require('dotenv').config();
process.env.NODE_ENV = 'development';

const path = require('path');
const merge = require('webpack-merge');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = merge.smart({
  entry: {
    'app': ['react-hot-loader/patch'],
  },
}, baseConfig, {
  devServer: {
    historyApiFallback: true,
    port: process.env.PORT || 8000,
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin(),
    new WatchMissingNodeModulesPlugin(path.join(__dirname, 'node_modules')),
    process.env.MOCK_API && new DefinePlugin({
      'process.env.SBANKEN_API_BASE_URL': '"http://localhost:4300/sbanken/api"',
      'process.env.SBANKEN_IDENTITY_SERVER_URL': '"http://localhost:4300/sbanken/identity/token"',
      'process.env.YNAB_API_BASE_URL': '"http://localhost:4300/ynab/api"',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      'react-dom': require.resolve('@hot-loader/react-dom'),
    },
  },
});
