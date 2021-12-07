const webpack = require('webpack')
const {merge} = require('webpack-merge')
const { CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const WebpackBundleAnglyzer = require('webpack-bundle-ang')

const commonConfig = require('./webpack.common')

let config = merge(commonConfig,{
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: 'chunk/[id].[contenthash:8].css'
    }),
    new webpack.ids.HashedModuleIdsPlugin()
  ],
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 800000,
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'all',
    }
  }
})

module.exports = config;
