const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map', // Avoid inline-*** and eval-*** use in production as they can increase bundle size and reduce the overall performance.

  output: {
    filename: 'main.js',
  },

  devServer: {
    client: {
      overlay: false,
    },

    static: {
      directory: path.join(__dirname, '../dist'),
    },

    port: 9000,
    hot: 'only',
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 
              {
                loader: 'css-loader',
                options: { sourceMap: true },
              },
              {
               loader: "postcss-loader",
               options: {
                 sourceMap: true,
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
            sourceMaps: 'both',
            compact: false,
           }
         },
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.STATS || "disabled",
    }),
  ],
});