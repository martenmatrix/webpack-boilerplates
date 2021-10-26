const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {

  mode: 'production',

  output: {
    // the hash is calculated from the code included in the js file, so if the code stays the same the hash also does
    // if a filename changes, the browser has it not in cache anymore, if the filename stays the same, it tries to get it from the cache
    // https://stackoverflow.com/questions/59194365/webpack-4-hash-and-contenthash-and-chunkhash-when-to-use-which
    filename: 'main.[contenthash].js',
    assetModuleFilename: 'assets/[contenthash][ext][query]',
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: { sourceMap: false },
              },
              {
               loader: "postcss-loader",
               options: {
                 sourceMap: false,
                 postcssOptions: { plugins: [["postcss-preset-env"]], },
                },
              }, // add sass loader after postcss loader (https://youtu.be/TOb1c39m64A?list=PLmZPx_9ZF_sB4orswXdpThGMX9ii2uP7Z&t=2155)
            ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { "debug": true, useBuiltIns: 'usage', corejs: 3 }]],
            inputSourceMap: false,
            sourceMaps: false,
            compact: true,
           }
         },
      },
    ]
  },

  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      '...', // '...' can be used in optimization.minimizer to access the defaults like terser
    ],
  },

  plugins: [
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ["imagemin-gifsicle", { interlaced: true }],
          ["imagemin-jpegtran", { progressive: true }],
          ["imagemin-optipng", { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          ["imagemin-svgo", {plugins: [{removeViewBox: true, removeXMLNS: true},],},],
        ],
      },
      loader: false, // does not add the imagemin-loader | this removes the bug that the plugin is svg is not installed, prob because it tries to convert it when importing it with js
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      }
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new CssMinimizerPlugin(),
  ],

});