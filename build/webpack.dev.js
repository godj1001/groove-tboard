const webpack = require('webpack')
const {merge} = require('webpack-merge')
const path = require('path')
const commonConfig = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = merge(commonConfig,{
  mode: 'development',
  devServer:{
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    proxy: {

    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'../public/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-source-map'
})
