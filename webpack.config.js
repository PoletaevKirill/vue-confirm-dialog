'use strict';

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-confirm-dialog.js',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "theme/vue-confirm-dialog.min.css",
    }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
},
},
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          output: {
            comments: /^!/
          }
        },
        extractComments: false
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [
              MiniCssExtractPlugin.loader,
              "css-loader"
            ],
            less: [
              MiniCssExtractPlugin.loader,
              "css-loader", 'less-loader'
            ],
            js: 'babel-loader',
            vue: 'vue'
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',

        }
      },
      {
        test: /\.css$/,
        use:
          [
            MiniCssExtractPlugin.loader,
            "css-loader",
          ]
      },
      {
        test: /\.less$/,
        use:
          [
            MiniCssExtractPlugin.loader,
            "css-loader", 'less-loader'
          ]
      },
    ]
  }
};