require('dotenv').config();
process.env.NODE_ENV = 'development';

const path = require('path');
const merge = require('webpack-merge');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge.smart(
  baseConfig,
  {
    devServer: {
      historyApiFallback: true,
      port: process.env.PORT || 8000,
    },
    devtool: 'cheap-module-source-map',
    mode: 'development',
    plugins: [
      new MiniCssExtractPlugin(),
      new WatchMissingNodeModulesPlugin(path.join(__dirname, 'node_modules')),
      new ReactRefreshWebpackPlugin({
        disableRefreshCheck: true,
      }),
    ],
  }
);
